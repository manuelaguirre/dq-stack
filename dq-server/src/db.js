const mongoose = require('mongoose').set('debug', true);
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(_.pick(this, ['_id', 'username']), config.get('jwtPrivateKey'));
	return token;
};

userSchema.methods.filterForResponse = function () {
	const response = _.pick(this, ['_id', 'username']);
	return response;
};

const playerSchema = new mongoose.Schema({
	email: { 
		type: String,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	password: String,
	playedQuestions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref : 'Question'
	}],
	stats: Number,
});

playerSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(_.pick(this, ['_id', 'email']), config.get('jwtPrivateKey'));
	return token;
};

playerSchema.methods.filterForResponse = function () {
	const response = _.pick(this, ['_id', 'email', 'firstName', 'lastName', 'playedQuestions']);
	return response;
};

const questionSchema = new mongoose.Schema({
	text: String,
	theme: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Theme'
	},
	answer1: String,
	answer2: String,
	answer3: String,
	answer4: String,
	correct: Number,
	video: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Video'
	},
	image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	},
	soundclip: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Soundclip'
	}
});

const CompanySchema = new mongoose.Schema({
	name: String,
	subname: String
});

const themeSchema = new mongoose.Schema({
	name: String,
	description: String,
	isPublic: Boolean,
	company: CompanySchema,
});

const imageSchema = new mongoose.Schema({ 
	name: String,
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}, 
	description: String, 
	img: 
	{
		data: Buffer, 
		contentType: String 
	} 
}); 

const User = mongoose.model('User', userSchema);
const Player = mongoose.model('Player', playerSchema);
const Question = mongoose.model('Question', questionSchema);
const Theme = mongoose.model('Theme', themeSchema);
const Image = mongoose.model('Image', imageSchema);
module.exports = { User, Player, Question, Theme, Image };