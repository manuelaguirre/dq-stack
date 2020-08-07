const express = require('express');
const questionController = require('../controllers/questions');
const themeController = require('../controllers/themes');
const { createQuestionSchema, updateQuestionSchema } = require('../validation/input');
const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	try {
		if (req.query.theme) {
			if (req.query.npb){
				if (req.query.npb) {
					//TODO: error prototype field for response code
					if (!req.query.limit) throw new Error('Must have a limit parameter');
					const questions = await questionController.getQuestionsNotPlayedBy(req.query.npb, req.query.theme, req.query.limit);
					return res.send(questions);
				}
			}
			const questionByTheme = await questionController.getQuestionsByTheme(req.query.theme);
			return res.status(200).send(questionByTheme);
		}   
		const questions =  await questionController.getQuestions();
		return res.status(200).send(questions);		
	} catch (error) {
		res.status(404).send(error.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const question = await questionController.getQuestion(req.params.id);
		return res.send(question);
		
	} catch (error) {
		res.status(404).send(error.message);
	}
});

router.post('/', async (req, res) => {
	let result = createQuestionSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await questionController.getQuestionByText(req.body.text);
	if (result) return res.status(409).send('Question with the same text already exists');
	let theme;
	try {
		theme = await themeController.getThemeByName(req.body.theme);
	} catch (error) {
		return res.status(404).send(error.message)
		
		;
	}
	result = await questionController.createQuestion({...req.body, theme : theme._id});
	res.send({...result, theme: theme.name});	
});

router.put('/:id', async (req,res) => {
	let result = updateQuestionSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	try {
		let theme;
		if (req.body.theme){
			theme = await themeController.getTheme(req.body.theme);
		}
		result = await questionController.getQuestionAndUpdate(req.params.id, req.body);
		return res.status(200).send({...result, theme : theme.name});		
	} catch (error) {
		return res.status(404).send(error.message);
	}

});

module.exports = router;
