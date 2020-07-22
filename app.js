const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test1', { useNewUrlParser: true })
	.then(console.log('connected to mongodb'))
	.catch(err => console.log(err));

const playerSchema = new mongoose.Schema({
	id: mongoose.ObjectId,
	firstName: String,
	lastName: String,
	playedQuestions: [ String ],
	stats: Number,
});


const Player = mongoose.model('Player', playerSchema);

async function createPlayer(){

	const testPlayer = new Player({
		firstName: 'Sebastian',
		lastName: 'Fernasnke',
		playedQuestions: null,
		stats: 2
	});
    
	const result = await testPlayer.save();
	console.log(result);
}

createPlayer();





const users = require('./routes/users');

app.use('./api/users', users);


const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));


