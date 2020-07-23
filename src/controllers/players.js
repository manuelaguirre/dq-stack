const { Player } = require('../db');

async function getPlayers() {
	const playerList = await Player.find().exec();
	return playerList;
}

async function getPlayerById(id) {
	const player = await Player.findById(id).exec();
	return player;
}

async function getPlayerByEmail(email){
	const player = await Player.find({email}).exec();
	return player;
}

async function createPlayer(player){

	const playerToAdd = new Player({
		...player
	});
	const result = await playerToAdd.save();
	return result;
}

module.exports = { 
	getPlayers,
	getPlayerById,
	getPlayerByEmail,
	createPlayer,
};
