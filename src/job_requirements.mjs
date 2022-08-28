import got from "got";
import _ from "lodash";
import {
	writeJsonFile,
	getCurrDate,
	transformReqToObjArr,
} from "./helpers.mjs";

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
	return sortedTransformed;
}

// writeJsonFile(
// 	"job_req",
// 	"job_requested_skills",
// 	getCurrDate(),
// 	sortedTransformed
// );
