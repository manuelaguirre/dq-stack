const auth = require('../middleware/auth');
const express = require('express');
const questionController = require('../controllers/questions');
const themeController = require('../controllers/themes');
const { createQuestionSchema, updateQuestionSchema } = require('../validation/input');
const asyncCatch = require('../middleware/asyncCatch');
const router = express.Router();
router.use(express.json());


router.get('/', auth, asyncCatch(async (req, res) => {
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
	
}));

router.get('/:id', auth, asyncCatch(async (req, res) => {
	const question = await questionController.getQuestion(req.params.id);
	return res.send(question);		
}));

router.post('/', auth, asyncCatch(async (req, res) => {
	let result = createQuestionSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	result = await questionController.getQuestionByText(req.body.text);
	if (result) return res.status(409).send('Question with the same text already exists');
	result = await questionController.createQuestion({...req.body, theme : theme._id});
	res.send(result);	
}));

router.put('/:id', auth, asyncCatch(async (req,res) => {
	let result = updateQuestionSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let theme;
	if (req.body.theme){
		theme = await themeController.getTheme(req.body.theme);
	}
	result = await questionController.getQuestionAndUpdate(req.params.id, req.body);
	return res.status(200).send({...result, theme : theme.name});
}));

module.exports = router;
