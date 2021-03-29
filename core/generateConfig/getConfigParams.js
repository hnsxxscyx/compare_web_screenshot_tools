import inquirer from 'inquirer';
import fs from 'fs-extra';

const currentPath = process.cwd();

const getLinksFiles = () => {
	const files = fs.readdirSync(`${currentPath}/assets/links`);
	const linksFiles = files.filter((name) => name.includes('.js'));
	return linksFiles;
};
const getQuestions = () => {
	return [
		{
			name: 'projectName',
			type: 'input',
			message: '请输入项目名称, 建议使用英文:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请输入项目名称.';
				}
			},
		},
		{
			name: 'baseUrl',
			type: 'input',
			message: '请输入项目baseUrl:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请输入项目baseUrl.';
				}
			},
		},
		{
			name: 'linksModule',
			type: 'list',
			choices: getLinksFiles(),
			message: '请选择links文件:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请选择links文件.';
				}
			},
		},
		{
			name: 'screens',
			type: 'checkbox',
			message: '请选择想要使用的屏幕尺寸:',
			choices: [
				'2560x1440',
				'1920x1080',
				'1440x900',
				'1336x1024',
				'1024x768',
				'768x1024',
				'414x736',
				'375x812',
				'375x667',
			],
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '请选择想要使用的屏幕尺寸.';
				}
			},
		},
	];
};

export const getConfigParams = async () => {
	const answer = await inquirer.prompt(getQuestions());
	const { linksModule } = answer;
	const { links } = await import(`${currentPath}/assets/links/${linksModule}`);
	answer.links = links;
	delete answer.linksModule;
	return answer;
};
