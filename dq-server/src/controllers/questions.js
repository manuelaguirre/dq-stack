const { Question } = require('../db');
const playerController = require('./players');
const _ = require('lodash');

async function getQuestions() {
	const questions = await Question.find()
		.exec();
	return questions;
}

async function getQuestion(id) {
	const question = await Question.findById(id)
		.exec();
	return question;
}

async function getQuestionsNotPlayedBy(playerIDs, theme, limit){
	let playedQuestionsAccumulator = [];
	for (const playerID of playerIDs) {
		const playedQuestions = await playerController.getPlayedQuestions(playerID);
		playedQuestionsAccumulator = [...playedQuestionsAccumulator, ...playedQuestions];
	}
	const result = await Question.find({
		_id: {$nin: playedQuestionsAccumulator},
		theme: theme
	})
		.limit(parseInt(limit, 10)).exec();
	return result;
}

async function getQuestionByText(text){	
	const query = Question.where({text});
	const question = await query.findOne()
		.populate('theme')
		.exec();
	return question;
}

async function getQuestionsByTheme(themeID){	
	const query = Question.where({theme : themeID});
	const questions = await query.find().exec(); 
	return questions;
}

async function getQuestionAndUpdate(id, update) {
	const question = await Question.findById(id).exec();
	Object.assign(question, update);
	question.save();	
	return question._doc;
}

async function createQuestion(question){
	const questionToAdd = new Question(
		_.pick(question,[
			'text',
			'theme',
			'answer1',
			'answer2',
			'answer3',
			'answer4',
			'correct',
			'video',
			'image',
			'soundclip'
		])
	);
	const result = await questionToAdd.save();	
	return result._doc;
}

module.exports = { 
	getQuestions,
	getQuestion,
	getQuestionsNotPlayedBy,
	getQuestionByText,
	getQuestionsByTheme,
	getQuestionAndUpdate,
	createQuestion,
};
