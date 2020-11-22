const auth = require('../middleware/auth');
const express = require('express');
const { importQuestions } = require('../controllers/fileImporter');
const asyncCatch = require('../middleware/asyncCatch');
const _ = require('lodash');
const router = express.Router();
router.use(express.json());

router.post('/', auth, asyncCatch(async (req, res) => {
	await importQuestions(req);
	res.send('pepe');
	
}));

module.exports = router;
