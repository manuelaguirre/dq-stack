const { Theme } = require('../db');

async function getThemes() {
	const themeList = await Theme.find().exec();
	if (!themeList) throw new Error('No themes found');	 
	return themeList;
}

async function getTheme(id) {
	const theme = await Theme.findById(id).exec();
	if (!theme) throw new Error('Theme not found');	 
	return theme;
}

async function getThemeAndUpdate(id, update) {
	const theme = await Theme.findById(id).exec();
	if (!theme) throw new Error('Theme not found');	 
	Object.assign(theme, update);
	theme.save();	
	return theme;
}

async function getThemeByName(name){	
	const query = Theme.where({name});
	const theme = await query.findOne();
	if (!theme) throw new Error('Theme not found');	 
	return theme;
}

async function createTheme(theme){
	//TODO: refactor to use lodash.pick
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
