import compareImages from 'resemblejs/compareImages.js';
import fs from 'fs-extra';
import { join } from 'path';
import dayJs from 'dayjs';

const getDiffImage = async ({ path1, path2, savePath }) => {
	const options = {
		output: {
			errorColor: {
				red: 255,
				green: 0,
				blue: 255,
			},
			errorType: 'movement',
			transparency: 0.3,
			largeImageThreshold: 1200,
			useCrossOrigin: false,
			outputDiff: true,
		},
		scaleToSameSize: true,
		ignore: 'antialiasing',
	};

	const data = await compareImages(
		await fs.readFile(path1),
		await fs.readFile(path2),
		options
	);
	if (!!data?.rawMisMatchPercentage) {
		await fs.outputFile(savePath, data.getBuffer());
	}
	return {
		isDifferent: !!data?.rawMisMatchPercentage,
		useTime: data?.analysisTime,
	};
};

const getAllImagesByPath = (path) => {
	const allFiles = [];
	const getFolderFiles = (path) => {
		const files = fs.readdirSync(path);
		files.forEach((item) => {
			const filePath = join(path, item);
			const stat = fs.statSync(filePath);
			if (stat.isDirectory() === true) {
				getFolderFiles(filePath);
			}
			if (stat.isFile() === true && item.includes('.png')) {
				allFiles.push(filePath);
			}
		});
	};
	getFolderFiles(path);
	return allFiles;
};

export const compare = async ({ originalPath, comparedPath }) => {
	const originalFilesPath = getAllImagesByPath(originalPath);
	const comparedFilesPath = getAllImagesByPath(comparedPath);
	const notExistFiles = [];
	const differentFiles = [];
	const now = dayJs().format('YYYY-MM-DD_HH-mm-ss');
	for (const originalFilePath of originalFilesPath) {
		const comparedFilePath = originalFilePath.replace(
			originalPath,
			comparedPath
		);
		const isExist = !!comparedFilesPath.find(
			(path) => path === comparedFilePath
		);
		const currentFile = originalFilePath.replace(originalPath, '');
		if (isExist) {
			const savePath = originalFilePath.replace(
				/\/images\/save\/.*\//,
				`/images/compare/${now}/`
			);
			console.log(`开始比对${currentFile}`);
			const compareResult = await getDiffImage({
				path1: originalFilePath,
				path2: comparedFilePath,
				savePath,
			});
			if (compareResult?.isDifferent) {
				differentFiles.push(savePath);
			}
			console.log(`比对完成${currentFile},用时${compareResult.useTime}ms`);
		} else {
			notExistFiles.push(currentFile);
		}
	}
	if (notExistFiles.length != 0) {
		console.log('对比项缺失以下图片:');
		console.log(notExistFiles);
	} else {
		console.log('需要对比的图片都有哦');
	}
	if (differentFiles.length != 0) {
		console.log('以下为输出不同图片:');
		console.log(differentFiles);
	} else {
		console.log('没有发现有什么不同诶');
	}
};
