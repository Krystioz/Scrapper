import fs from "fs";

export function writeJsonFile(path, name, nameId, content) {
	fs.writeFile(
		`${path}/${name}&${nameId}.json`,
		`${JSON.stringify(content)}`,
		(err) => console.log(err)
	);
}

export function getCurrDate() {
	var d = new Date(),
		dformat =
			[d.getMonth() + 1, d.getDate(), d.getFullYear()].join(":") +
			"-" +
			[d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
	return dformat;
}

export function floorRandom(between) {
	if (between < 10 || typeof between != "number") {
		return Math.floor(Math.random() * 10);
	} else {
		return Math.floor(Math.random() * between);
	}
}

export function transformReqToObjArr(data) {
	const arr = [];
	data.forEach(function (el) {
		arr.push({ name: el[0], count: el[1] });
	});
	return arr;
}
