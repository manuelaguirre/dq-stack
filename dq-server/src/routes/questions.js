const express = require('express');
const questionController = require('../controllers/questions');
const themeController = require('../controllers/themes');
const { createQuestionSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	const questions =  await questionController.getQuestions();
	return res.send(questions);
});

router.get('/:id', async (req, res) => {
	const question = await questionController.getQuestion(req.params.id);
	return res.send(question);
});

router.post('/', async (req, res) => {
	let result = createQuestionSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await questionController.getQuestionByText(req.body.text);
	if (result) return res.status(400).send('Question with the same text already exists');
	let theme;
	try {
		theme = await themeController.getThemeByName(req.body.theme);
	} catch (error) {
		return res.status(404).send(error.message);
	}
	result = await questionController.createQuestion({...req.body, theme : theme._id});
	res.send({...result, theme: theme.name});	
});

router.put('/:id', async (req,res) => {

	let theme;
	if (req.body.theme){
		try {
			theme = await themeController.getThemeByName(req.body.theme);
		} catch (error) {
			return res.status(404).send(error.message);
		}
	}
	let result = await questionController.getQuestionAndUpdate(req.params.id, {...req.body, theme: theme.id});
	if (!result) {
		return res.status(404).send();
	}
	return res.status(200).send({...result, theme: theme.name});

});

module.exports = router;
