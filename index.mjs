// import fs from "fs";
// import cheerio from "cheerio";
import got from "got";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import _ from "lodash";

const vgmUrl = "https://justjoin.it/api/offers";

got(vgmUrl)
	.then((result) => {
		const parsed = JSON.parse(result.body);
		handleResult(parsed);
	})
	.catch((err) => {
		console.log(err);
	});

function handleResult(result) {
	const parsed = result;
	const titles = getTitles(parsed);
	console.log(titles);
}

function getTitles(res) {
	const mappedTitles = _.map(res, (e, i) => e.title);
	const occurences = _.reduce(
		mappedTitles,
		function (acc, curr) {
			return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
		},
		{}
	);
	const arrOfArr = Object.entries(occurences);
	return transformToObjArr(arrOfArr);
}

function transformToObjArr(data) {
	const arr = [];
	data.forEach(function (el) {
		arr.push({ name: el[0], count: el[1] });
	});
	return arr;
}
