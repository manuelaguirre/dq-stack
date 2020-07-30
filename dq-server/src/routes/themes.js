const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const themeController = require('../controllers/themes');
const { createThemeSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	const themes =  await themeController.getThemes();
	if (req.query.name) {
		const themeByName = await themeController.getThemeByName(req.query.name);
		return res.send(themeByName);
	}   
	return res.send(themes);
});

router.get('/:id', async (req, res) => {
	const theme = await themeController.getTheme(req.params.id);
	return res.send(theme);
});

router.post('/', async (req, res) => {
	let result = createThemeSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await themeController.getThemeByName(req.body.name);
	if (result) return res.status(400).send('Theme already exists');
	result = await themeController.createTheme(req.body);
	res.send(result);	
});

router.put('/:id', async (req,res) => {
	let result = await themeController.getThemeAndUpdate(req.params.id, req.body);
	if (!result) {
		return res.status(404).send();
	}
	return res.status(200).send(result);

});

module.exports = router;
