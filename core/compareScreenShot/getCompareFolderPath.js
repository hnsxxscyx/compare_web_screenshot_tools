import inquirer from 'inquirer';
import fs from 'fs-extra';

const getSelectedProject = async () => {
	const selectProject = async (projectList) => {
		const questions = [
			{
				name: 'projectName',
				type: 'list',
				message: '请选择想操作的项目:',
				choices: projectList,
				validate: function (value) {
					if (value.length) {
						return true;
					} else {
						return '请选择想操作的项目.';
					}
				},
			},
		];
		return await inquirer.prompt(questions);
	};
	let result;
	const files = fs.readdirSync(`${process.cwd()}/project/`);
	const projectList = files.filter((name) =>
		fs.pathExistsSync(`${process.cwd()}/project/${name}/images/save`)
	);
	if (projectList.length > 0) {
		const { projectName } = await selectProject(projectList);
		result = projectName;
	} else {
		throw new Error('未检测到可进行对比的项目');
	}
	return result;
};

const getCompareFolderList = (imagesPath) => {
	let result;
	const folders = fs.readdirSync(imagesPath);
	if (folders.length <= 1) {
		throw new Error('该项目无法进行比对');
	} else {
		result = folders;
	}
	return result;
};

const getCompareQuestions = (imagesPath) => {
	const choices = getCompareFolderList(imagesPath);
	return [
		{
			name: 'originalPath',
			type: 'list',
			choices,
			message: '请选择基础项:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请选择基础项.';
				}
			},
		},
		{
			name: 'comparedPath',
			type: 'list',
			choices,
			message: '请选择对比项:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请选择基础项.';
				}
			},
		},
	];
};

export const getCompareFolderPath = async () => {
	const projectName = await getSelectedProject();
	const imagesPath = `${process.cwd()}/project/${projectName}/images/save`;
	const questions = await getCompareQuestions(imagesPath);
	const answer = await inquirer.prompt(questions);
	for (const key in answer) {
		answer[key] = imagesPath + '/' + answer[key];
	}
	return answer;
};
