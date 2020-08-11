const { User } = require('../db');
const bcrypt = require('bcrypt');
const _ = require('lodash');

async function getUsers() {
	const userList = await User.find().exec();
	return userList;
}

async function getUser(id) {
	const user = await User.findById(id).exec();
	return user;
}

async function getUserAndUpdate(id, update) {
	const user = await User.findById(id).exec();
	Object.assign(user, update);
	user.save();	
	return user;
}

async function getUserByName(username){	
	const query = User.where({username});
	const user = await query.findOne(); 
	return user;
}

async function createUser(user){

	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(user.password, salt);
	//TODO: refactor to use lodash.pick
	const userToAdd = new User({
		username : user.username,
		password : hashed,				
	});
	const result = await userToAdd.save();	
	return result;
}

module.exports = { 
	getUsers,
	getUser,
	getUserAndUpdate,
	getUserByName,
	createUser
};
