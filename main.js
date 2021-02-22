import { Builder, By, Key, until } from 'selenium-webdriver';
import dotenv from 'dotenv';
import colors from 'colors-console';
import { testFunc } from './test.js';
const chrome = require('selenium-webdriver/chrome');
dotenv.config();

function getUrl() {
	const modal = process.env.MODAL;
	let url = '';
	switch (modal) {
		case 'local':
			url = process.env.LOCAL_URL;
			break;

		default:
			break;
	}
	return url;
}

(async function main() {
	let driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(new chrome.Options().headless())
		.build();
	try {
		const baseUrl = getUrl();
		await testFunc(driver, baseUrl);
	} finally {
		await driver.sleep(10000);
		await driver.quit();
	}
})();
