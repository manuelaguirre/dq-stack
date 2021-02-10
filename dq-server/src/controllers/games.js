const { getQuestionsNotPlayedBy } = require('./questions');
const { getTheme } = require('./themes');
const { getPlayer } = require('./players');
const { Game } = require('../db');

async function getGames() {
	const game = await Game.find()
		.exec();
	return game;
}

async function getGame(id) {
	const game = await Game.findById(id)
		.populate([
			{ path: 'players'},
			{ path: 'themes'},
		])
		.exec();
	return game;
}

async function getLastGame() {
	const lastGame = await Game.findOne({datePlayed: null}).sort({dateCreated: -1}).exec();
	return lastGame;
}

async function createGame(name, playerIDs, themesIDs) {
	const themes = [];
	for (const themeID of themesIDs) {
		const theme = await getTheme(themeID);
		if (!theme) throw new Error(`Theme not found: "${themeID}"`);
		themes.push(theme);
	}

	const players = [];
	for (const playerID of playerIDs) {
		const player = await getPlayer(playerID);
		if (!player) throw new Error(`Player not found: "${playerID}"`); 
		players.push(player);
	}

	const gameToAdd = new Game({ 
		name,
		players : playerIDs,
		themes : themesIDs,
	});
	const result = gameToAdd.save();
	return result;
}

async function getGameAndUpdate(id, body) {
	const game = await Game.findById(id).exec();
	// TODO: if game is empty, throw error 404
	for (const playerID of (body.players || [])) {
		const player = await getPlayer(playerID);
		if (!player) throw new Error(`Player not found: "${playerID}"`);
	}
	for (const themeID of (body.themes || [])) {
		const theme = await getTheme(themeID);
		if (!theme) throw new Error(`Theme not found: "${themeID}"`);
	}
	if (body.results) {
		body.datePlayed = Date.now();
	}
	Object.assign(game, body);
	game.save();
	return game;
}

async function prepareGame() {
	const lastGame = await getLastGame();

	const questionPools = [];

	for (const themeID of lastGame.themes) {
		const theme = await getTheme(themeID);
		if (!theme) throw new Error(`Theme not found: "${themeID}"`);

		const questions = await getQuestionsNotPlayedBy(lastGame.players, themeID, 12);
		questionPools.push({
			questions,
			theme,
		});
	}

	const players = [];
	for (const playerID of lastGame.players) {
		const player = await getPlayer(playerID);
		players.push(player);
	}

	return { _id: lastGame._id, players, questionPools};
}

module.exports = {
	getGame,
	createGame,
	getGameAndUpdate,
	getGames,
	prepareGame
};
