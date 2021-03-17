import { getConfigParams } from './getConfigParams.js';
import { generateConfigTemplate } from './generateConfigTemplate.js';
import fs from 'fs-extra';

export const generateConfig = async () => {
	const answer = await getConfigParams();
	const configsTemplate = generateConfigTemplate(answer);
	const { projectName } = answer;
	fs.outputFile(
		`${process.cwd()}/project/${projectName}/config/index.js`,
		configsTemplate,
		'utf8'
	);
};
