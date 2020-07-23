const express = require('express');
//const HttpStatus = require('http-status-codes');

//const { guest, auth } = require('../middleware/auth');
// const { catchAsync } = require('../middleware/errors');
// const { validate } = require('../validation/joi');
// const { registerSchema, updateSchema } = require('../validation/auth');
const playerController = require('../controllers/players');
const router = express.Router();

// router.get('/', auth, catchAsync(async (req, res) => {
// 	const user = await userController.findUserById(req.session.userId);
// 	return res.send(user);
// }));

router.get('/', async (req, res) => {
	const user =  await playerController.getPlayers();
	console.log(user);
    
	return res.send(user);
});
    

module.exports = router;