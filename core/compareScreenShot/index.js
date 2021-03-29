import { getCompareFolderPath } from './getCompareFolderPath.js';
import { compare } from './compare.js';

export const compareScreenShot = async () => {
	const { originalPath, comparedPath } = await getCompareFolderPath();
	await compare({ originalPath, comparedPath });
};
