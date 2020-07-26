const { Player } = require('../db');

async function getPlayers() {
	const playerList = await Player.find().exec();
	return playerList;
}

async function getPlayer(id) {
	const player = await Player.findById(id).exec();
	return player;
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

	const playerToAdd = new Player({
		firstName : player.firstName,
		lastName : player.lastName,
		email : player.email,
		stats : null,
		playedQuestions : null
	});
	const result = await playerToAdd.save();
	return result;
}

module.exports = { 
	getPlayers,
	getPlayer,
	getPlayerAndUpdate,
	getPlayerByEmail,
	createPlayer,
};
