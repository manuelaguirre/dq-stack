const express = require('express');
const { loginSchema } = require('../validation/login');
const userController = require('../controllers/users');
const router = express.Router();
const bcrypt = require('bcrypt');

router.use(express.json());

router.post('/', async (req, res) => {
	let result = loginSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await userController.getUserByName(req.body.username);
	if (!result) return res.status(401).send('Invalid email or password');
    
	const isValidPassword = await bcrypt.compare(req.body.password, result.password);
	if (!isValidPassword) return res.status(401).send('Invalid email or password'); 
    
	const token = result.generateAuthToken();
	return res.send(token);
});

module.exports = router;