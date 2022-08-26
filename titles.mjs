import got from "got";
import _ from "lodash";
import fs from "fs";
import { compareTwoStrings } from "string-similarity";

const vgmUrl = "https://justjoin.it/api/offers";

got(vgmUrl)
	.then((result) => {
		const parsed = JSON.parse(result.body);
		let jobTitles = getTitlesArr(parsed);
		let sortedTitles = jobTitles.sort((a, b) => b.count - a.count);
		let grouppedTitles = getCompared(sortedTitles);
		let sortedGrouppedTitles = grouppedTitles.sort((a, b) => b.score - a.score);
		//deleting similar arr to make console.log() clearer to read
		_.each(sortedGrouppedTitles, (e) => delete e.similar);
		console.log(sortedGrouppedTitles);
	})
	.catch((err) => {
		console.log(err);
	});

function getTitlesArr(res) {
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

function getCompared(parsedData) {
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
		`titles_groupped/titles_groupped${getCurrDate()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}

function writeOffersFile(res) {
	fs.writeFile(
		`offer_files/justJoinData${getCurrDate()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}
