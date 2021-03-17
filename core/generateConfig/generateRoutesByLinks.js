const formatList = (links, baseUrl) => {
	return links
		.replace(/\[/g, '')
		.replace(/\]/g, '')
		.replace(/\"/g, '')
		.replace(new RegExp(baseUrl, 'g'), '')
		.split(',');
};
const transformLinkToRoute = (link, target) => {
	const subLinkList = link.split('/').filter(Boolean);
	const generateNewUrlTarget = (subLink, children) => {
		const existSubLink = children.find((item) => {
			return item.url === subLink;
		});
		if (!existSubLink) {
			const obj = {
				url: subLink,
			};
			children.push(obj);
			return obj;
		} else {
			return existSubLink;
		}
	};
	let lastTarget = target;
	let lastChildren = target.children;
	subLinkList.forEach((subLink, index) => {
		if (index !== 0) {
			if (!lastTarget.children) {
				lastTarget.children = [];
			}
			lastChildren = lastTarget.children;
		}
		lastTarget = generateNewUrlTarget(subLink, lastChildren);
	});
	return target;
};

export const generateRoutesByLinks = ({ baseUrl, links }) => {
	let routes = [
		{
			url: '',
			imageInfo: {
				prefix: 'index',
			},
			children: [],
		},
	];
	const formattedLinks = formatList(links, baseUrl);
	formattedLinks.forEach((link) => {
		transformLinkToRoute(link, routes[0]);
	});
	return routes;
};
