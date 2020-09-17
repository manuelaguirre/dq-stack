const auth = require('../middleware/auth');
const express = require('express');
const questionController = require('../controllers/questions');
const themeController = require('../controllers/themes');
const { readCSVStream, processCSVLine} = require('../controllers/fileImporter');
const asyncCatch = require('../middleware/asyncCatch');
const router = express.Router();
router.use(express.json());

router.post('/', auth, asyncCatch(async (req, res) => {
	const result = await readCSVStream(req, processCSVLine, consolelog);
	return res.send(result);
}));

function consolelog(a){
	console.log(a);
}

module.exports = router;
