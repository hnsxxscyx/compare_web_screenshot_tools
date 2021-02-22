import { TestDriver } from './testCase/test/index.js';

export const testFunc = async (driver, baseUrl) => {
	driver.get(baseUrl);
	let testInstance;
	// test
	testInstance = new TestDriver({ driver, baseUrl });
	await testInstance.test();
};
