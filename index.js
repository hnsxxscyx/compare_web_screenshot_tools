import figlet from 'figlet';
import inquirer from 'inquirer';
import { generateConfig } from './core/generateConfig/index.js';
import { generateScreenShot } from './core/generateScreenShot/index.js';
import { compareScreenShot } from './core/compareScreenShot/index.js';

const firstQuestion = async () => {
	const questions = [
		{
			name: 'work',
			type: 'list',
			message: '你想做什么:',
			choices: ['生成config', '生成项目截图', '对比项目截图'],
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return '选择你想做什么.';
				}
			},
		},
	];
	return await inquirer.prompt(questions);
};

const main = async () => {
	console.log(figlet.textSync('Welcome', { horizontalLayout: 'full' }));
	const { work } = await firstQuestion();
	switch (work) {
		case '生成config': {
			generateConfig();
			break;
		}
		case '生成项目截图': {
			generateScreenShot();
			break;
		}
		case '对比项目截图': {
			compareScreenShot();
			break;
		}
		default:
			break;
	}
};
try {
	main().catch((error) => {
		console.error(error.message);
	});
} catch (error) {
	console.error(error.message);
}
