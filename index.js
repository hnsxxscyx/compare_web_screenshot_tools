const { Builder, By, Key, until } = require('selenium-webdriver');
require('dotenv').config();

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
	let driver = await new Builder().forBrowser('chrome').build();
	try {
		const url = getUrl();
		await driver.get(url);
		await driver
			.findElement('.MuiInputBase-input .MuiFilledInput-input')
			.sendKeys('ca', Key.ENTER);
		// await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
		// await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
	} finally {
		await driver.sleep(10000);
		await driver.quit();
	}
})();†
