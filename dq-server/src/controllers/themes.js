const { Theme } = require('../db');

async function getThemes(options = {lean: false}) {
	const themeList = options.lean ? await Theme.find().lean().exec() : await Theme.find().exec();
	return themeList;
}

async function getTheme(id) {
	const theme = await Theme.findById(id).exec();
	return theme;
}

async function getThemeAndUpdate(id, update) {
	const theme = await Theme.findById(id).exec();
	if (update.company === '') update.company = undefined;
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
	//TODO: refactor to use lodash.pick
	const themeToAdd = new Theme({
		name : theme.name,
		description : theme.description,
		isDefault: theme.isDefault,
		isPublic: theme.isPublic,
		company : theme.company
	});
	const result = await themeToAdd.save();	
	return result;
}

async function deleteTheme(themeID) {
	const result = await Theme.deleteOne({_id : themeID}); 
	return result;
}

module.exports = { 
	getThemes,
	getTheme,
	getThemeAndUpdate,
	getThemeByName,
	createTheme,
	deleteTheme
};
