import got from "got";
import _ from "lodash";
import fs from "fs";
import { compareTwoStrings } from "string-similarity";

const vgmUrl = "https://justjoin.it/api/offers";

got(vgmUrl)
	.then((result) => {
		const parsed = JSON.parse(result.body);
		let jobTitles = handleResult(parsed);
		let titles = compareJobTitles(jobTitles);
		let sortedTitles = titles.sort((a, b) => b.length - a.length);
		writeTitles(sortedTitles);
		// console.log(rawdata.split(","))
		// writeOffersFile(parsed);
	})
	.catch((err) => {
		console.log(err);
	});

function handleResult(result) {
	const parsed = result;
	const titles = getTitles(parsed);
	return titles;
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

function writeOffersFile(res) {
	fs.writeFile(
		`offer_files/justJoinData${Date.now()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}

function writeTitles(res) {
	fs.writeFile(
		`titles_files/titles_sorted${floorRandom(1000)}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}

function compareJobTitles(titles) {
	let titleObjects = [];

	titles.forEach(function (el, indx) {
		let isMatch = false;
		let nameObj = [];
		let name = el.name;
		nameObj.push(name);

		titles.forEach(function (e, i) {
			let similarity = compareTwoStrings(
				name.toLowerCase(),
				e.name.toLowerCase()
			);
			if (similarity > 0.95) {
				if (indx != i) {
					isMatch = true;
					// console.log(name, e.name, similarity);
					nameObj.push(e.name);
				}
			}
		});
		// if (isMatch) {
		// 	titleObjects.push(nameObj);
		// } else {
		// 	nameObj.push(name);
			titleObjects.push(nameObj);
		// }
	});
	return titleObjects;
}

function floorRandom(between) {
	if (between < 10000 || typeof between != "number") {
		return Math.floor(Math.random() * 10000);
	} else {
		return Math.floor(Math.random() * between);
	}
}
