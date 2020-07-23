const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const {CORS_OPTIONS} = require('./config/cors');

app.use(cors(CORS_OPTIONS));
app.use(morgan('dev'));


mongoose.connect('mongodb://localhost/test1', { useNewUrlParser: true })
	.then(console.log('connected to mongodb'))
	.catch(err => console.log(err));

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

const players = require('./routes/players');
app.use('/api/players', players);


const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));


