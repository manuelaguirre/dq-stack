const { getQuestionsNotPlayedBy } = require('./questions');
const { getTheme } = require('./themes');
const { getPlayer } = require('./players');
const { Game } = require('../db');

async function getGames() {
	const playerList = await Game.find().exec();
	return playerList;
}

async function createGame(playerIDs, themesIDs){
	const questionPools = [];
	
	for (const themeID of themesIDs) {
		const theme = await getTheme(themeID);
		if (!theme) throw new Error(`Theme not found: "${themeID}"`);
		
		const questions = await getQuestionsNotPlayedBy(playerIDs, themeID, 12);
		questionPools.push({
			questions,
			theme 
		});
	}

	const players = [];
	for (const playerID of playerIDs) { 
		const player = await getPlayer(playerID);
		players.push(player);
	}	

	const gameToAdd = new Game({players, questionPools});
	const result = gameToAdd.save();
	return result;
}

module.exports = {
	createGame,
	getGames,
};
