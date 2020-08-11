const { Player } = require('../db');
const bcrypt = require('bcrypt');
const _ = require('lodash');

async function getPlayers() {
	const playerList = await Player.find().exec();
	return playerList;
}

async function getPlayer(id) {
	const player = await Player.findById(id).exec();
	return player;
}

async function getPlayedQuestions(id){
	const result = await Player.findById(id,'playedQuestions').exec();
	return result.playedQuestions;
}

async function getPlayerAndUpdate(id, update) {
	const player = await Player.findById(id).exec();
	Object.assign(player, update);
	player.save();	
	return player;
}

async function getPlayerByEmail(email){	
	const query = Player.where({email});
	const player = await query.findOne(); 
	return player;
}

async function createPlayer(player){

	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(player.password, salt);
	//TODO: refactor to use lodash.pick
	const playerToAdd = new Player({
		firstName : player.firstName,
		lastName : player.lastName,
		email : player.email,
		password : hashed,				
	});
	const result = await playerToAdd.save();	
	return result;
}

async function addQuestions(id, questionsToAdd){
	let player = await Player.findById(id).exec();
	if (!player) throw new Error('Player not found');	
	await player.updateOne( 
		{'$addToSet': { 'playedQuestions': questionsToAdd}}
	);
	return player;	
}

module.exports = { 
	getPlayers,
	getPlayer,
	getPlayedQuestions,
	getPlayerAndUpdate,
	getPlayerByEmail,
	createPlayer,
	addQuestions
};
