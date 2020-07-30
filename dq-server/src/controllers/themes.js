const { Theme } = require('../db');

async function getThemes() {
	const themeList = await Theme.find().exec();
	return themeList;
}

async function getTheme(id) {
	const theme = await Theme.findById(id).exec();
	return theme;
}

async function getThemeAndUpdate(id, update) {
	const theme = await Theme.findById(id).exec();
	Object.assign(theme, update);
	theme.save();	
	return theme;
}

async function getThemeByName(name){	
	const query = Theme.where({name});
	const theme = await query.findOne(); 
	return theme;
}

async function createTheme(theme){
	const themeToAdd = new Theme({
		name : theme.name,
		description : theme.description
	});
	const result = await themeToAdd.save();	
	return result;
}

module.exports = { 
	getThemes,
	getTheme,
	getThemeAndUpdate,
	getThemeByName,
	createTheme,
};
