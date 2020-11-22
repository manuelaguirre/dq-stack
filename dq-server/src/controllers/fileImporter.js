const _ = require('lodash');
const csv = require('csv-parser');
const { getThemes, createTheme } = require('./themes');
const { createQuestion, getQuestionByText } = require('./questions');
const { createQuestionSchema } = require('../validation/input');

async function importQuestions(stream){
	const errors = [];
	const alreadyExistsWarnings = [];
	const questions = [];
	const added = {
		questions : 0,
		themes : 0
	};
	
	const themeSet = await createThemeSet();

	return new Promise((resolve) => {

		stream.pipe(csv())
			.on('data', async (chunk) => {
				questions.push(chunk);
			})
			.on('end', async() => {
				for (const question of questions) {
					await processLine(question, themeSet, added, errors, alreadyExistsWarnings);
				}
				resolve({
					errors, 
					warnings : alreadyExistsWarnings,
					message : `Created ${added.themes} new themes. Imported ${added.questions} questions`
				});
			});
	});
	
}

async function processLine(chunk, themeSet, added, errors, alreadyExistsWarnings){
	try {
		if (!themeSet[chunk.theme]){
			themeSet[chunk.theme] = await getNewThemeID(chunk.theme, chunk.name, chunk.subname);
			added.themes++;
		}
		chunk.theme = themeSet[chunk.theme].toString();
		
		let result = createQuestionSchema.validate(chunk);
		if (result.error) {
			throw new Error(result.error.details[0].message);
		}
		let question = await getQuestionByText(chunk.text);
		if (question) throw new AlreadyExistsException(chunk.Id);
		
		question = await createQuestion(chunk);
		added.questions++;
	} catch (ex) {
		if (ex.id){
			alreadyExistsWarnings.push(`Warning. Line ${ex.id} text already exists in the database. It was not overwritten`);
		} else {
			errors.push(`Error in line ${chunk.Id}: ${ex.message}`);
		}
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

function AlreadyExistsException(id) {
	this.id = id;
}

async function createThemeSet() {
	const themeList = await getThemes({ lean: true });
	const themeSet = {};
	themeList.forEach((element) => {
		const id = element._id.toString();
		themeSet[element.name] = id;
	});
	return themeSet;
}

module.exports = {
	importQuestions,
};
