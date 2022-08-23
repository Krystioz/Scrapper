import got from "got";
import _ from "lodash";
import fs from "fs";

const vgmUrl = "https://justjoin.it/api/offers";

got(vgmUrl)
	.then((result) => {
		const parsed = JSON.parse(result.body);
		// writeOffersFile(parsed);
		handleResult(parsed);
	})
	.catch((err) => {
		console.log(err);
	});

function handleResult(result) {
	const parsed = result;
	const titles = getTitles(parsed);
	console.log(titles)
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
		`offer_files/justJoinData${Date.now()}`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}
