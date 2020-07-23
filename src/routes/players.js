const express = require('express');
//const HttpStatus = require('http-status-codes');

//const { guest, auth } = require('../middleware/auth');
// const { catchAsync } = require('../middleware/errors');
// const { validate } = require('../validation/joi');
// const { registerSchema, updateSchema } = require('../validation/auth');
const playerController = require('../controllers/players');
const router = express.Router();
router.use(express.json());


// router.get('/', auth, catchAsync(async (req, res) => {
// 	const user = await userController.findUserById(req.session.userId);
// 	return res.send(user);
// }));

router.get('/', async (req, res) => {
	const users =  await playerController.getPlayers();    
	return res.send(users);
});

router.get('/:id', async (req, res) => {
	const user = await playerController.getPlayerById(req.params.id);
	return res.send(user);
});

router.post('/', async (req, res) => {
	const result = await playerController.createPlayer(req.body);
	return res.send(result);

});

module.exports = router;
