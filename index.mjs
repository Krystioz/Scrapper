// import fs from "fs";
// import cheerio from "cheerio";
import got from "got";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import _ from "lodash";

const vgmUrl = "https://justjoin.it/api/offers";

got(vgmUrl)
	.then((result) => {
		// console.log(result.body);
		// console.log(Object.keys(result.body));
		// let keys = Object.entries(result.body);
		const parsed = JSON.parse(result.body);
		const keyedRes = Object.entries(parsed);
		console.log(keyedRes);
	})
	.catch((err) => {
		console.log(err);
	});

// const dom = new JSDOM(``, {
// 	url: vgmUrl,
// 	contentType: "text/html",
// 	includeNodeLocations: true,
// 	storageQuota: 10000000,
// });
