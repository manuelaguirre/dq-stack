const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const {CORS_OPTIONS} = require('./middleware/cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

app.use(cors(CORS_OPTIONS));
app.use(morgan('dev'));



console.log(config.get('name'));


mongoose.connect(config.get('db.host'), { ...config.get('db.config') })
	.then(console.log('connected to mongodb'))
	.catch(err => console.log(err));

const players = require('./routes/players');
app.use('/api/players', players);


const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));


