const auth = require('../middleware/auth');
const express = require('express');
const { importQuestions } = require('../controllers/fileImporter');
const asyncCatch = require('../middleware/asyncCatch');
const _ = require('lodash');
const router = express.Router();
router.use(express.json());

router.post('/', auth, asyncCatch(async (req, res) => {
	const result = await importQuestions(req);
	if (!_.isEmpty(result.errors)){
		return res.status(400).send(result.errors);
	} else {
		return res.send(result.questionsToAdd);
	}
}));

module.exports = router;
