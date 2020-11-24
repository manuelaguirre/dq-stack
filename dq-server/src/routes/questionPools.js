const auth = require('../middleware/auth');
const express = require('express');
const asyncCatch = require('../middleware/asyncCatch');
const { getQuestionPools } = require('../controllers/questions');
const router = express.Router();
router.use(express.json());

router.get('/', auth, asyncCatch(async (req, res) => {

	if (!req.query.npb){
		res.status(400);
		throw new Error('Must specify playerIDs in npb query param');
	}

	if(typeof req.query.npb === 'string'){
		req.query.npb = [req.query.npb]; //Express parser returns string literal for single values
	}
	
	const questions = await getQuestionPools(req.query.npb);
	return res.status(200).send(questions);
}));

module.exports = router;