const auth = require('../middleware/auth');
const express = require('express');
const themeController = require('../controllers/themes');
const { createThemeSchema, updateThemeSchema } = require('../validation/input');
const asyncCatch = require('../middleware/asyncCatch');
const router = express.Router();
router.use(express.json());


router.get('/', auth, asyncCatch(async (req, res) => {
	const themes = await themeController.getThemes();
	if (req.query.name) {
		const themeByName = await themeController.getThemeByName(req.query.name);
		return res.send(themeByName);
	}   
	return res.send(themes);		
}));

router.get('/:id', auth, asyncCatch(async (req, res) => {
	const theme = await themeController.getTheme(req.params.id);
	return res.send(theme);		
}));

router.post('/', auth, asyncCatch(async (req, res) => {
	let result = createThemeSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const theme = await themeController.getThemeByName(req.body.name);
	if (theme) return res.status(409).send('Theme already exists');
	result = await themeController.createTheme(result.value);
	return res.send(result);	
}));

router.put('/:id', auth, asyncCatch(async (req,res) => {
	let result = updateThemeSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	try {
		result = await themeController.getThemeAndUpdate(req.params.id, req.body);		
	} catch (error) {
		res.status(404).send(error.message);
	}	
	return res.status(200).send(result);
}));

module.exports = router;
