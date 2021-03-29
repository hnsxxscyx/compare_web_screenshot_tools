import { generateRoutesByLinks } from './generateRoutesByLinks.js';
export const generateConfigTemplate = ({ baseUrl, links, screens }) => {
	const routes = generateRoutesByLinks({ baseUrl, links });
	return `
	import dayJs from 'dayjs';
	const baseUrl = '${baseUrl}';
	
	const routes = ${JSON.stringify(routes)}
	
	const screenInfos = [
		${screens.map((item) => '[' + item.split('x').join(',') + ']').join(',\n')}
	].map((item) => {
		return { width: item[0], height: item[1] };
	});
	
	const imageInfo = {
		prefix: '',
		suffix: '',
	};
	
	const saveInfo = {
		folderName: dayJs().format('YYYY-MM-DD_HH-mm-ss'),
	};
	
	const compareInfo = {
		isCommonCompare: true,
		originalFolder: '',
		compareFolder: '',
		// compare file
		map: [
			{
				originalPath: '',
				comparePath: '',
			},
		],
	};
	
	export { baseUrl, routes, screenInfos, imageInfo, compareInfo, saveInfo };
	`;
};
