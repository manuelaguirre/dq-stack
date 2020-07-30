const Joi = require('joi');

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

const createQuestionSchema = Joi.object({
});



module.exports = { createPlayerSchema, createThemeSchema, createQuestionSchema };