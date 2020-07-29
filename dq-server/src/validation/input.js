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

module.exports = { createPlayerSchema };