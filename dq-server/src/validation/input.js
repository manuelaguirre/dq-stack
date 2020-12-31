const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createUserSchema = Joi.object({
	username: Joi.string()
		.alphanum()
		.min(2)
		.max(30)
		.required(),

	password: Joi.string()
		.min(8)
		.max(20)
		.required() 
});

const createPlayerSchema = Joi.object({
	firstName: Joi.string()
		.min(2)
		.max(30)
		.required(),
       
	lastName: Joi.string()
		.min(2)
		.max(30)
		.required(),

	email: Joi.string()
		.email()
		.required(),

	password: Joi.string()
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
		.required(),
		
	isPublic: Joi.boolean()
		.default(true),

	company: Joi.when('isPublic', {is: false, then: Joi.object({
		name: Joi.string()
			.min(2)
			.max(30)
			.required(),
	
		subname: Joi.string()
			.min(2)
			.max(30)
	}).required(), 

	otherwise: Joi.valid(null)}),
});

const updateThemeSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(20),

	description: Joi.string()
		.min(3)
		.max(300),
		
	isPublic: Joi.boolean()
		.default(true),

	company: Joi.when('isPublic', {is: false, then: Joi.object({
		name: Joi.string()
			.min(2)
			.max(30)
			.required(),

		subname: Joi.string()
			.min(2)
			.max(30)
	}),otherwise: Joi.valid(null)}),
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
	
	image: Joi.objectId(),
})
	.unknown();

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
	
	video: Joi.objectId(),
	image: Joi.objectId(),
	soundclip: Joi.objectId(),
});

const createGameSchema = Joi.object({
	name: Joi.string(),

	players: Joi.array().items(Joi.objectId()),

	themes: Joi.array().items(Joi.objectId())
});

module.exports = { 
	createUserSchema,
	createPlayerSchema,
	createThemeSchema,
	updateThemeSchema,
	createQuestionSchema,
	updateQuestionSchema,
	createGameSchema, 
};