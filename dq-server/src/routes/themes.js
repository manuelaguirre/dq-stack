const express = require('express');
const themeController = require('../controllers/themes');
const { createThemeSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	try {
		const themes =  await themeController.getThemes();
		if (req.query.name) {
			const themeByName = await themeController.getThemeByName(req.query.name);
			return res.send(themeByName);
		}   
		return res.send(themes);		
	} catch (error) {
		res.status(404).send(error.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const theme = await themeController.getTheme(req.params.id);
		return res.send(theme);		
	} catch (error) {
		res.status(404).send(error.message);
	}
});

router.post('/', async (req, res) => {
	let result = createThemeSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await themeController.getThemeByName(req.body.name);
	if (result) return res.status(409).send('Theme already exists');
	result = await themeController.createTheme(req.body);
	res.send(result);	
});

router.put('/:id', async (req,res) => {
	let result;
	try {
		result = await themeController.getThemeAndUpdate(req.params.id, req.body);		
	} catch (error) {
		res.status(404).send(error.message);
	}	
	return res.status(200).send(result);
});

module.exports = router;
