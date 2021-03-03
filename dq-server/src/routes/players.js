const { auth, authorize } = require('../middleware/auth');
const express = require('express');
const playerController = require('../controllers/players');
const { createPlayerSchema } = require('../validation/input');
const asyncCatch = require('../middleware/asyncCatch');
const router = express.Router();
router.use(express.json());


router.get('/', auth, asyncCatch(async (req, res) => {
	const players =  await playerController.getPlayers();
	const filteredPlayers = players.map(player => player.filterForResponse());
	if (req.query.email) {
		const userByEmail = await playerController.getPlayerByEmail(req.query.email.toString());
		return res.send(userByEmail);
	}   
	return res.send(filteredPlayers);
}));

router.get('/:id', auth, asyncCatch(async (req, res) => {
	const player = await playerController.getPlayer(req.params.id);
	return res.send(player.filterForResponse());
}));

router.post('/', authorize('admin'), asyncCatch(async (req, res) => {
	let result = createPlayerSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await playerController.getPlayerByEmail(req.body.email);
	if (result) return res.status(400).send('User already registered');
	result = await playerController.createPlayer(req.body);	
	const token = result.generateAuthToken();
	return res.header('x-auth-token', token).send(result.filterForResponse());
}));

router.put('/:id', authorize('admin'), asyncCatch(async (req,res) => {
	let result = await playerController.getPlayerAndUpdate(req.params.id, req.body);
	if (!result) {
		return res.status(404).send();
	}
	return res.status(200).send(result);
}));

router.patch('/:id', authorize('admin'), asyncCatch(async (req,res) => {
	try {
		const player = await playerController.addQuestions(req.params.id, req.body.playedQuestions);
		res.send(player.filterForResponse());		
	} catch (error) {
		res.status(404).send(error.message);
	}
}));

module.exports = router;
