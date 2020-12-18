const { getQuestionsNotPlayedBy } = require('./questions');
const { getPlayer } = require('./players');
const { Game } = require('../db');

async function createGame(playerIDs, themesIDs){
	const questionPools = [];
	
	for (const themeID of themesIDs) {
		const questions = await getQuestionsNotPlayedBy(playerIDs, themeID, 12);
		questionPools.push({
			themeID,
			questions
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
};
