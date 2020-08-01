const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const playerController = require('../controllers/players');
const { createPlayerSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	const users =  await playerController.getPlayers();
	if (req.query.email) {
		const userByEmail = await playerController.getPlayerByEmail(req.query.email.toString());
		return res.send(userByEmail);
	}   
	return res.send(users);
});

router.get('/:id', async (req, res) => {
	const player = await playerController.getPlayer(req.params.id);
	return res.send(player);
});

router.post('/', async (req, res) => {
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
});

router.put('/:id', async (req,res) => {
	let result = await playerController.getPlayerAndUpdate(req.params.id, req.body);
	if (!result) {
		return res.status(404).send();
	}
	return res.status(200).send(result);

});

module.exports = router;
