const express = require('express');
const { authSchema } = require('../validation/auth');
const userController = require('../controllers/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');

router.use(express.json());

router.post('/', async (req, res) => {
	let result = authSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await userController.getUserByName(req.body.username);
	if (!result) return res.status(400).send('Invalid email or password');
    
	const isValidPassword = await bcrypt.compare(req.body.password, result.password);
	if (!isValidPassword) return res.status(400).send('Invalid email or password'); 
    
	const token = result.generateAuthToken();
	return res.send(token);
});

module.exports = router;