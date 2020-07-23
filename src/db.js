const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
	id: mongoose.ObjectId,
	firstName: String,
	lastName: String,
	playedQuestions: [ String ],
	stats: Number,
});


const Player = mongoose.model('Player', playerSchema);

module.exports = {Player};