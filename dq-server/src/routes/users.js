const auth = require('../middleware/auth');
const express = require('express');
const userController = require('../controllers/users');
const { createUserSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', auth, async (req, res) => {
	const users =  await userController.getUsers();
	if (req.query.username) {
		const userByName = await userController.getUserByName(req.query.username.toString());
		return res.send(userByName);
	}   
	return res.send(users);
});

router.get('/:id', auth, async (req, res) => {
	const user = await userController.getUser(req.params.id);
	return res.send(user);
});

router.post('/', async (req, res) => {
	let result = createUserSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await userController.getUserByName(req.body.username);
	if (result) return res.status(400).send('User already registered');
	result = await userController.createUser(req.body);	
	const token = result.generateAuthToken();
	return res.header('x-auth-token', token).send('User created.');
});

module.exports = router;
