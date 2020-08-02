const mongoose = require('mongoose').set('debug', true);
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

const playerSchema = new mongoose.Schema({
	email: { 
		type: String,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	password: String,
	playedQuestions: [ String ],
	stats: Number,
});

playerSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(_.pick(this, ['_id', 'email']), config.get('jwtPrivateKey'));
	return token;
};

playerSchema.methods.filterForResponse = function () {
	const response = _.pick(this, ['_id', 'email', 'firstName', 'lastName']);
	return response;
};

const questionSchema = new mongoose.Schema({
	text: String,
	theme: String,
	answers: [{text: String, correct: Boolean}],
	video: String,
	images: [{imageID: String}],
	soundclip: String
});

const themeSchema = new mongoose.Schema({
	name: String,
	description: String
});

const Player = mongoose.model('Player', playerSchema);
const Question = mongoose.model('Question', questionSchema);
const Theme = mongoose.model('Theme', themeSchema);
module.exports = { Player, Question, Theme };