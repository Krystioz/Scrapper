import express from "express";
import morgan from "morgan";
import bp from "body-parser";
import { jobRequiredTechnologies } from "./src/job_requirements.mjs";
import { logTitles } from "./src/titles_rework.mjs";

const { urlencoded, json } = bp;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan("dev"));

app.get("/requirements", async (req, res) => {
	let result = await jobRequiredTechnologies();
	res.json({ data: result });
});

app.get("/titles", async (req, res) => {
	let result = await logTitles();
	res.json({ data: result });
});

// app.post("/todo", (req, res) => {
// 	const newTodo = { complete: false, id: Date.now(), text: req.body.text };
// 	db.todos.push(newTodo);

// 	res.json({ data: newTodo });
// });

// app.get("/monster", (req, res) => {
// 	const newMonster = {
// 		name: "slime",
// 		hp: 1,
// 		atk: 15,
// 		str: 12,
// 		attr: req.body.attribute,
// 	};
// 	res.json({ result: newMonster });
// });

app.listen(8000, () => {
	console.log("Server on http://localhost:8000");
});
