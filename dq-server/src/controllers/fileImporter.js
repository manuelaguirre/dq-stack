const _ = require('lodash');
const csv = require('csv-parser');
const { getThemes } = require('./themes');
const { createQuestion, getQuestionByText } = require('./questions');
const { createQuestionSchema } = require('../validation/input');

async function importQuestions(stream) {
	const streamData = await readCSVStream(stream, verifyCSVLine, () => {});
	streamData.errors = filterNullElements(streamData.errors);
	if (!_.isEmpty(streamData.errors)) return streamData;
	for await (const question of streamData.questionsToAdd) {
		await createQuestion(question);
	}
	return streamData;
}

async function readCSVStream(stream, callback, callbackOnEnd){
	const themeSet = await createThemeSet();
	let errors = [];
	let questionsToAdd = [];
	const streamFromFile = new Promise((resolve) =>{
		stream.pipe(csv())
			.on('data', (data) => {
				data.theme = themeSet[data.theme];
				const question = new Promise((resolve) =>{
					resolve(data);
				});
				const error = new Promise((resolve) =>{
					const error = callback(data);
					resolve(error);
				});
				questionsToAdd.push(question);
				errors.push(error);				
			})
			.on('end', () => {
				callbackOnEnd(errors);
				resolve();
			});
	});
	await streamFromFile;
	const allErrors = Promise.all(errors);
	const allQuestions = Promise.all(questionsToAdd);
	return {
		questionsToAdd: await allQuestions,
		errors : await allErrors
	};
}

//TODO: maybe move this to Theme Schema
async function createThemeSet(){
	const themeList = await getThemes({lean: true});
	const themeSet = {};
	themeList.forEach((element) => {
		const id = element._id.toString();
		themeSet[element.name] = id;
	});
	return themeSet;
}

async function verifyCSVLine(data) {
	const validation = createQuestionSchema.validate(data);
	if (!data.theme){
		const error = `\nCould not import line ${data.Id}: Invalid theme`;
		return error; 
	}
	if (validation.error){
		const error = `\nCould not import line ${data.Id}: ${validation.error.details[0].message}`;
		return error;
	}
	const result = await getQuestionByText(data.text);
	const error = new Promise((resolve) => {
		if (!_.isEmpty(result)){
			resolve(`\nCould not import line ${data.Id}: Question with the same text already exists`);
		} else {
			resolve(null);
		}
	});
	return error;
}

function filterNullElements(array) {
	return array.filter(element => element !== null);
}

module.exports = { 
	readCSVStream,
	verifyCSVLine,
	importQuestions
};
