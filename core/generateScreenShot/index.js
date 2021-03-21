import { driver, setWindowHeightSameScrollHeight } from './brower.js';
import { getScreenShot } from './getScreenShot.js';
import lodash from 'lodash';
import fs from 'fs-extra';
import { selectProject } from './selectProject.js';

async function getConfig({ path }) {
	const configModule = await import(
		`${process.cwd()}/project/${path}/config/index.js`
	);
	return configModule;
}

function getRouteConfigProcess({ screenInfo, routes, baseUrl, imageInfo }) {
	let result = [];
	for (const route of routes) {
		route.screenInfo = screenInfo;
		route.url = baseUrl + (route.url ? '/' + route.url : '');
		if (!route.imageInfo) {
			route.imageInfo = imageInfo;
		}
		if (Array.isArray(route.children)) {
			const childrenList = getRouteConfigProcess({
				routes: route.children,
				screenInfo,
				baseUrl: route.url,
				imageInfo,
			});
			result = result.concat(childrenList);
			delete route.children;
		}
		result.push(route);
	}
	return result;
}

function getImageConfigProcess({ baseUrl, routes, screenInfos, imageInfo }) {
	const { cloneDeep } = lodash;
	let result = [];
	for (const screenInfo of screenInfos) {
		const cloneRoutes = cloneDeep(routes);
		const list = getRouteConfigProcess({
			screenInfo,
			routes: cloneRoutes,
			baseUrl,
			imageInfo,
		});
		result = result.concat(list);
	}
	return result;
}

async function saveImageByConfig({
	configs,
	baseUrl,
	projectName,
	folderName,
}) {
	for await (const config of configs) {
		console.log(config.url);
		await driver.manage().window().setRect(config.screenInfo);
		await driver.get(config.url);
		const data = await getScreenShot({ delay: 10000 });
		await fs.outputFile(
			`./project/${projectName}/images/save/${folderName}/${
				config.screenInfo.width
			}_${config.screenInfo.height}/${
				config.imageInfo.prefix || ''
			}${config.url.replace(baseUrl, '').replace('/', '')}${
				config.imageInfo.suffix || ''
			}.png`,
			data,
			'base64'
		);
	}
}

async function main() {
	const projectName = await selectProject();
	const configs = await getConfig({ path: projectName });
	const finalConfigs = getImageConfigProcess(configs);
	await saveImageByConfig({
		configs: finalConfigs,
		baseUrl: configs.baseUrl,
		projectName,
		folderName: configs.saveInfo.folderName,
	});
}

export const generateScreenShot = () => {
	main()
		.catch((err) => {
			console.error(err);
			console.warn('执行出错');
		})
		.finally(async () => {
			await driver.sleep(10000);
			await driver.quit();
		});
};
