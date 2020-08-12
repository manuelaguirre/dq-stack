const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createUserSchema = Joi.object({
  
	username :Joi.string()
		.alphanum()
		.min(2)
		.max(30)
		.required(),

	password : Joi.string()
		.min(8)
		.max(20)
		.required() 
});

const createPlayerSchema = Joi.object({
	firstName : Joi.string()
		.alphanum()
		.min(2)
		.max(30)
		.required(),
       
	lastName :Joi.string()
		.alphanum()
		.min(2)
		.max(30)
		.required(),

	email : Joi.string()
		.email()
		.required(),

	password : Joi.string()
		.min(8)
		.max(20)
		.required() 
});

const createThemeSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(20)
		.required(),

	description: Joi.string()
		.min(3)
		.max(300)
		.required()
});

const updateThemeSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(20)
		.required(),

	description: Joi.string()
		.min(3)
		.max(300)
		.required()
});

const createQuestionSchema = Joi.object({
	text: Joi.string()
		.min(3)
		.max(300)
		.required(),

	theme: Joi.objectId()
		.required(),

	answer1: Joi.string()
		.min(1)
		.max(256)		
		.required(),

	answer2: Joi.string()
		.min(1)
		.max(256)		
		.required(),

	answer3: Joi.string()
		.min(1)
		.max(256)		
		.required(),

	answer4: Joi.string()
		.min(1)
		.max(256)		
		.required(),

	correct: Joi.number()
		.min(0)
		.max(3),
	
	video: Joi.objectId(),
	image: Joi.objectId(),
	soundclip: Joi.objectId(),
});

const updateQuestionSchema = Joi.object({
	text: Joi.string()
		.min(3)
		.max(300),
		
	theme: Joi.objectId(),
		
	answer1: Joi.string()
		.min(1)
		.max(256),		
		

	answer2: Joi.string()
		.min(1)
		.max(256),		
		
	answer3: Joi.string()
		.min(1)
		.max(256),		
		
	answer4: Joi.string()
		.min(1)
		.max(256),		
		
	correct: Joi.number()
		.min(0)
		.max(3),
	
	video: Joi.objectId(),
	image: Joi.objectId(),
	soundclip: Joi.objectId(),
});





module.exports = { 
	createUserSchema,
	createPlayerSchema,
	createThemeSchema,
	updateThemeSchema,
	createQuestionSchema,
	updateQuestionSchema 
};