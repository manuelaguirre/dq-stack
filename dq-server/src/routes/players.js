const express = require('express');
const Joi = require('joi');
//const HttpStatus = require('http-status-codes');

//const { guest, auth } = require('../middleware/auth');
// const { catchAsync } = require('../middleware/errors');
// const { validate } = require('../validation/joi');
// const { registerSchema, updateSchema } = require('../validation/auth');
const playerController = require('../controllers/players');
const { createPlayerSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


// router.get('/', auth, catchAsync(async (req, res) => {
// 	const user = await userController.findUserById(req.session.userId);
// 	return res.send(user);
// }));

router.get('/', async (req, res) => {
	const users =  await playerController.getPlayers();
	if (req.query.email) {
		const userByEmail = await playerController.getPlayerByEmail(req.query.email.toString());
		return res.send(userByEmail);
	}   
	return res.send(users);
});

router.get('/:id', async (req, res) => {
	const user = await playerController.getPlayer(req.params.id);
	return res.send(user);
});

router.post('/', async (req, res) => {
	let result = createPlayerSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await playerController.createPlayer(req.body);
	return res.send(result);
});

router.put('/:id', async (req,res) => {
	let result = await playerController.getPlayerAndUpdate(req.params.id, req.body);
	if (!result) {
		return res.status(400).send();
	}
	return res.status(200).send(result);

});

module.exports = router;
