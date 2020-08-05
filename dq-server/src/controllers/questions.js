const { Question } = require('../db');
const _ = require('lodash');

async function getQuestions() {
	const questionList = await Question.find()
		.populate('theme', 'name')
		.exec();
	return questionList;
}

async function getQuestion(id) {
	const question = await Question.findById(id).exec();
	return question;
}

async function getQuestionByText(text){	
	const query = Question.where({text});
	const question = await query.findOne().exec(); 
	return question;
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
	getQuestionByText,
	getQuestionAndUpdate,
	createQuestion,
};
