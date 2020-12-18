const auth = require('../middleware/auth');
const express = require('express');
const asyncCatch = require('../middleware/asyncCatch');
const { createGameSchema } = require('../validation/input');
const { createGame } = require('../controllers/games');
const router = express.Router();
router.use(express.json());

router.post('/', auth, asyncCatch(async (req, res) => {

	let result = createGameSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	result = await createGame(req.body.players, req.body.themes);
	res.send(result);	
}));

module.exports = router;