import inquirer from 'inquirer';
import fs from 'fs-extra';

const getSelectedProject = async (projectList) => {
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

export const selectProject = async () => {
	let result;
	const files = fs.readdirSync(`${process.cwd()}/project/`);
	const projectList = files.filter((name) =>
		fs.pathExistsSync(`${process.cwd()}/project/${name}/config/index.js`)
	);
	if (projectList.length > 0) {
		const { projectName } = await getSelectedProject(projectList);
		result = projectName;
	} else {
		console.log('未检测到项目');
	}
	return result;
};
