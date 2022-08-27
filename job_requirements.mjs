import got from "got";
import _ from "lodash";
import fs from "fs";
import { compareTwoStrings } from "string-similarity";

const vgmUrl = "https://justjoin.it/api/offers";

export async function jobRequiredTechnologies() {
	let res = await got(vgmUrl);
	let parsed = JSON.parse(res.body);
	let mapped = _.map(parsed, (e) => e.skills).flat();

	let countedMap = _.countBy(mapped, (e) =>
		e.name
			.toLowerCase()
			.replace(
				/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
				""
			)
			.replace("-", "")
			.toString()
	);
	const arrOfArr = Object.entries(countedMap);
	let transformed = transformReqToObjArr(arrOfArr);
    let sortedTransformed = transformed.sort((a, b) => b.count - a.count);
    writeJobReq(sortedTransformed)
	console.log(sortedTransformed);
}

function transformReqToObjArr(data) {
	const arr = [];
	data.forEach(function (el) {
		arr.push({ name: el[0], count: el[1] });
	});
	return arr;
}

function writeJobReq(res) {
	fs.writeFile(
		`job_req/job_req&${getCurrDate()}.json`,
		`${JSON.stringify(res)}`,
		(err) => console.log(err)
	);
}


function getCurrDate() {
	var d = new Date(),
		dformat =
			[d.getMonth() + 1, d.getDate(), d.getFullYear()].join(":") +
			"-" +
			[d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
	return dformat;
}

jobRequiredTechnologies();
