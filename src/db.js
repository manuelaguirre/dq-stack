const mongoose = require('mongoose').set('debug', true);

const playerSchema = new mongoose.Schema({
	email: { 
		type: String,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	playedQuestions: [ String ],
	stats: Number,
});


const Player = mongoose.model('Player', playerSchema);

module.exports = {Player};