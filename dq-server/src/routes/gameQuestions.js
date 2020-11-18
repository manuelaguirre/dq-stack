const auth = require('../middleware/auth');
const express = require('express');
const asyncCatch = require('../middleware/asyncCatch');
const { getQuestionsForGame } = require('../controllers/questions');
const router = express.Router();
router.use(express.json());

router.get('/', auth, asyncCatch(async (req, res) => {
	if (req.query.theme.length != 3) {
		res.status(400);
		throw new Error('Must specify 3 themes');
	}
	if (!req.query.npb){
		res.status(400);
		throw new Error('Must specify playerIDs in npb query param');
	}
	
	const questions = await getQuestionsForGame(req.query.npb, req.query.theme);
	return res.status(200).send(questions);
}));

module.exports = router;