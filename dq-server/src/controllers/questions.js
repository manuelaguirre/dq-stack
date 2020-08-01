const { Question } = require('../db');
const _ = require('lodash');

async function getQuestions() {
	const questionList = await Question.find().exec();
	return questionList;
}

async function getQuestion(id) {
	const question = await Question.findById(id).exec();
	return question;
}

async function getQuestionByText(text){	
	const query = Question.where({text});
	const question = await query.findOne(); 
	return question;
}

async function getQuestionAndUpdate(id, update) {
	const question = await Question.findById(id).exec();
	Object.assign(question, update);
	question.save();	
	return question;
}

async function createQuestion(question){
	const questionToAdd = new Question(
		_.pick(question,[
			'text',
			'theme',
			'answers',
			'video',
			'image',
			'soundclip'
		])
	);
	const result = await questionToAdd.save();	
	return result;
}

module.exports = { 
	getQuestions,
	getQuestion,
	getQuestionByText,
	getQuestionAndUpdate,
	createQuestion,
};
