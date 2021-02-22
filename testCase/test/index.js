import { By } from 'selenium-webdriver';
const fs = require('fs');
class BaseDriver {
	constructor({ driver, baseUrl }) {
		this.driver = driver;
		this.url = baseUrl + '/';
	}
	driver;
	url;
}

function getElement(params) {
	return By.css(params);
}

export class TestDriver {
	constructor({ driver, baseUrl }) {
		this.driver = driver;
		this.url = baseUrl + '/';
	}
	driver;
	url;
	async test() {
		await this.mainPage();
	}

	async savePageShot() {
		const url = await this.driver.getCurrentUrl();
		const element = await this.driver.findElement(getElement('html'));
		console.log(element.size);
		const info = {
			width: element.scrollWidth,
			height: element.scrollHeight,
		};
		console.log(info);
		await this.driver.manage().window().setRect(info);
		const data = await this.driver.takeScreenshot();
		await fs.writeFileSync(`./test-shot.png`, data, 'base64');
	}

	async allSubpage() {}

	async mainPage() {
		const url = this.url + 'scrap-my-car';
		const needExistElementList = ['.scrap-my-car-page'];
		await this.driver.get(url);
		// for await (rule of needExistElementList) {
		// 	this.driver.findElement(rule).catch((err) => {
		// 		console.log(`element ${JSON.stringify(rule)} don't exist`);
		// 	});
		// }
		await this.savePageShot();
		await Promise.all(
			needExistElementList.map((rule) => {
				return this.driver.findElement(getElement(rule)).catch((err) => {
					console.error(`element ${JSON.stringify(rule)} don't exist`);
					throw err;
				});
			})
		)
			.then(() => {
				console.log('all good');
			})
			.catch((err) => {
				throw err;
			});
	}
}
