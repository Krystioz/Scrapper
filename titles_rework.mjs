import got from "got";
import _ from "lodash";
import fs from "fs";
import { compareTwoStrings } from "string-similarity";

const vgmUrl = "https://justjoin.it/api/offers";
// RUNNING THE CODE HERE
logTitles();

// END OF SECTION TO RUN THE CODE

async function logTitles() {
	let res = await got(vgmUrl)
		.then((res) => JSON.parse(res.body))
		.then((res) => getTitlesObjArr(res))
		.then((res) => res.sort((a, b) => b.count - a.count))
		.then((res) => getSimilarAndScore(res))
		.then((res) => res.sort((a, b) => b.score - a.score))
		.then((res) => _.each(res, (e) => delete e.similar))
		// .then((res) => console.log(res))
		.catch((err) => {
			console.log(err);
		});
}



function getTitlesObjArr(res) {
	const mappedTitles = _.map(res, (e, i) => e.title);
	const occurences = _.countBy(mappedTitles, (e) =>
		e
			.toLowerCase()
			.replace(
				/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
				""
			)
			.replace("-", "")
	);
	const arrOfArr = Object.entries(occurences);
	console.log(arrOfArr)
	return transformTitlesToObjArr(arrOfArr);
}

function transformTitlesToObjArr(data) {
	const arr = [];
	data.forEach(function (el) {
		arr.push({ name: el[0], count: el[1] });
	});
	return arr;
}

function floorRandom(between) {
	if (between < 10000 || typeof between != "number") {
		return Math.floor(Math.random() * 10000);
	} else {
		return Math.floor(Math.random() * between);
	}
}

function getCurrDate() {
	var d = new Date(),
		dformat =
			[d.getMonth() + 1, d.getDate(), d.getFullYear()].join(":") +
			"-" +
			[d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
	return dformat;
}

function getSimilarAndScore(parsedData) {
	let similarObj = [];

	for (let e = 0; e < 20; e++) {
		let titleObj = {
			title: parsedData[e].name,
			occurences: parsedData[e].count,
			included_in_count: 0,
			score: 0,
			similar: [],
		};

		parsedData.forEach(function (el, ind) {
			if (el.name.includes(parsedData[e].name)) {
				if (e != ind) {
					if (titleObj.similar.length < 15) {
						titleObj.similar.push({ name: el.name, count: el.count });
						titleObj.included_in_count++;
					}
				}
			}
			// if not includes compare the strings and include the string if the score is big enough
		});
		titleObj.score = titleObj.occurences + titleObj.included_in_count * 0.8;
		similarObj.push(titleObj);
	}
	return similarObj;
}

function writeTitles(res) {
	fs.writeFile(
		`titles_groupped/titles_groupped&${getCurrDate()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}

function writeOffersFile(res) {
	fs.writeFile(
		`offer_files/justJoinData&${getCurrDate()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}
