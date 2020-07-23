const { Player } = require('../db');

async function getPlayers() {
	const playerList = await Player.find();
	console.log(playerList);		
	return playerList;
}

module.exports = { getPlayers };