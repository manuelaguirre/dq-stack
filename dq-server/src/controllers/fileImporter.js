const { Question } = require('../db');
const _ = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const { getThemes } = require('./themes');
const { createQuestion, getQuestionByText } = require('./questions');
const { createQuestionSchema } = require('../validation/input');


async function readCSVStream(stream, callback, callbackOnEnd){
	const themeSet = await createThemeSet();
	console.log('themeSet', themeSet);
	let lineIndex = 0;
	let errors = [];
	let questionsAdded = [];
	let streamFileToDB = new Promise((resolve, reject) => {
		stream.pipe(csv())
			.on('data', (data) => {
				console.log('data', data);
				data.theme = themeSet[data.theme];
				let result = callback(errors, data, lineIndex);
				if (result){
					questionsAdded.push(result);
				} 
				lineIndex++;
			})
			.on('end', () => {
				callbackOnEnd(errors);
				resolve();
			});
			
	});
	await streamFileToDB;	
	console.log(questionsAdded, errors, 'return de la func');
	return {
		questionsAdded,
		errors
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

async function processCSVLine(errors, data, lineIndex) {
	console.log(data);
	const validation = createQuestionSchema.validate(data);
	if (validation.error){
		console.log(validation.error,' validation');
		const message = `\nCould not import line ${lineIndex}: ${validation.error.details[0].message}`;
		errors.push(message);
		return;
	}
	const result = await getQuestionByText(data.text);
	if (result){
		const message = `\nCould not import line ${lineIndex}: Question with the same text already exists`;
		errors.push(message);
		return;
	}
	let questionToAdd = await createQuestion(data);
	return questionToAdd;
}







module.exports = { 
	readCSVStream,
	processCSVLine,
};
