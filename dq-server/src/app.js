const error = require('./middleware/error');
const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const {CORS_OPTIONS} = require('./middleware/cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const login = require('./routes/login');
const players = require('./routes/players');
const questions = require('./routes/questions');
const themes = require('./routes/themes');
const users = require('./routes/users');
const fileImporter = require('./routes/fileImporter');
const games = require('./routes/games');

app.use(cors(CORS_OPTIONS));
app.use(morgan('dev'));

app.use('/api/login', login);
app.use('/api/players', players);
app.use('/api/questions', questions);
app.use ('/api/games', games);
app.use('/api/themes', themes);
app.use('/api/users', users);
app.use('/api/import', fileImporter);
app.use(error);

console.log(config.get('name'));
if(!config.get('jwtPrivateKey')){
	console.error('FATAL ERROR - JWT Private Key does not exist');
	process.exit(1);
}


mongoose.connect(config.get('db.host'), { ...config.get('db.config') })
	.then(console.log('connected to mongodb'))
	.catch(err => console.log(err));



const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));


