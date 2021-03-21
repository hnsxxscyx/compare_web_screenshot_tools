import { Builder, By } from 'selenium-webdriver';

import chrome from 'selenium-webdriver/chrome.js';

let driver = await new Builder()
	.forBrowser('chrome')
	.setChromeOptions(new chrome.Options().headless())
	.build();

const setWindowHeightSameScrollHeight = async ({ id = '__next' }) => {
	let scrollHeight = await driver.executeScript(
		'return document.body.scrollHeight'
	);
	let scrollWidth = await driver.executeScript(
		'return document.body.scrollWidth'
	);
	await driver
		.manage()
		.window()
		.setRect({ width: scrollWidth, height: scrollHeight });
	await driver.sleep(10000);
	await driver.executeScript('window.scrollTo(0,document.body.scrollHeight)');
	await driver.sleep(10000);
	scrollHeight = await driver.executeScript(
		'return document.body.scrollHeight'
	);
	await driver
		.manage()
		.window()
		.setRect({ width: scrollWidth, height: scrollHeight });
	await driver.executeScript('window.scrollTo(0,0)');
};
export { driver, setWindowHeightSameScrollHeight };
