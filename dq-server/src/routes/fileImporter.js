const { authAdmin } = require('../middleware/auth');
const express = require('express');
const { importQuestions } = require('../controllers/fileImporter');
const asyncCatch = require('../middleware/asyncCatch');
const router = express.Router();
router.use(express.json());

router.post('/', authAdmin, asyncCatch(async (req, res) => {
	let result = await importQuestions(req);
	res.send(result);
}));
module.exports = router;
