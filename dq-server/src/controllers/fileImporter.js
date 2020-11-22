const _ = require('lodash');
const csv = require('csv-parser');
const { getThemes, createTheme } = require('./themes');
const { createQuestion, getQuestionByText } = require('./questions');
const { createQuestionSchema } = require('../validation/input');

async function importQuestions(stream){

	const themeSet = await createThemeSet();
	stream.pipe(csv())
		.on('data', (chunk) => processLine(chunk, themeSet));
}

async function processLine(chunk, themeSet){
	try {
		let question = await getQuestionByText(chunk.text);
		if (question) throw new Error(`Line ${chunk.Id}:Question with the same text already exists`);
		if (!themeSet[chunk.theme]){
			themeSet[chunk.theme] = getNewThemeID(chunk.theme, chunk.name, chunk.subname);
		}
		chunk.theme = await themeSet[chunk.theme];
		question = await createQuestion(chunk);
	} catch (error) {
		console.log(error);
	}
}

async function getNewThemeID(name, companyName, companySubname){
	const theme = {
		name,
		description: 'No description.',
		isPublic : !companyName,
	};
	if(!theme.isPublic){
		theme.company = {
			name : companyName,
			subname : companySubname
		};
	}
	const result = await createTheme(theme);
	return result._id;
}



// async function importQuestions(stream) {
// 	const streamData = await readCSVStream(stream, verifyCSVLine, () => {});

// 	streamData.errors = filterNullElements(streamData.errors);
// 	if (!_.isEmpty(streamData.errors)) return streamData;

// 	for await (const theme of streamData.questionsToAdd) {
// 		await createTheme({
// 			name: theme
// 		});
// 	}
// 	for await (const question of streamData.questionsToAdd) {
// 		await createQuestion(question);
// 	}
// 	return streamData;
// }

// async function readCSVStream(stream, callback, callbackOnEnd) {
// 	const themeSet = await createThemeSet();
// 	let errors = [];
// 	let questionsToAdd = [];
// 	let themesToAdd = [];
// 	const streamFromFile = new Promise((resolve) => {
// 		stream.pipe(csv())
// 			.on('data', (data) => {

// 				if (!themeSet[data.theme]) {
// 					let newTheme;
// 					themesToAdd.push({
// 						name : data.theme,
// 						isPublic : !data.name						
// 					});
// 				}

// 				const question = new Promise((resolve) => {
// 					resolve(data);
// 				});
// 				const lineError = new Promise((resolve) => {
// 					const lineError = callback(data);
// 					resolve(lineError);
// 				});
// 				questionsToAdd.push(question);
// 				errors.push(lineError);
// 			})
// 			.on('end', () => {
// 				callbackOnEnd(errors);
// 				resolve();
// 			});
// 	});
// 	await streamFromFile;
// 	const allErrors = Promise.all(errors);
// 	const allQuestions = Promise.all(questionsToAdd);
// 	const allThemes = Promise.all(themesToAdd);
// 	return {
// 		questionsToAdd: await allQuestions,
// 		errors: await allErrors,
// 		themesToAdd : await allThemes
// 	};
// }

//TODO: maybe move this to Theme Schema
async function createThemeSet() {
	const themeList = await getThemes({ lean: true });
	const themeSet = {};
	themeList.forEach((element) => {
		const id = element._id.toString();
		themeSet[element.name] = id;
	});
	return themeSet;
}

// async function verifyCSVLine(data) {
// 	const validation = createQuestionSchema.validate(data);
// 	if (!data.theme) {
// 		const error = `\n Line ${data.Id}: ${
// 			data.theme
// 		} does not exist. Create the theme beforehand.'`;
// 		return error;
// 	}
// 	if (validation.error) {
// 		const error = `\n Line ${data.Id}: ${validation.error.details[0].message}.`;
// 		return error;
// 	}
// 	const result = await getQuestionByText(data.text);
// 	const error = new Promise((resolve) => {
// 		if (!_.isEmpty(result)) {
// 			resolve(
// 				`\n Line ${data.Id}: Question with the same text already exists.`
// 			);
// 		} else {
// 			resolve(null);
// 		}
// 	});
// 	return error;
// }

// function filterNullElements(array) {
// 	return array.filter((element) => element !== null);
// }

module.exports = {
	importQuestions,
};
