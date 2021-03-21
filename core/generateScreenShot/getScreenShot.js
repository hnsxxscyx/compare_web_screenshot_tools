import { driver, setWindowHeightSameScrollHeight } from './brower.js';

export const getScreenShot = async (
	{ delay, scrollToBottom } = { delay: 0, scrollToBottom: false }
) => {
	await new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
	await setWindowHeightSameScrollHeight({});

	const data = await driver.takeScreenshot();
	return data;
};
