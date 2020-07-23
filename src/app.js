const express = require('express');
const app = express();
const cors = require('cors');
const {CORS_OPTIONS} = require('./config/cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

app.use(cors(CORS_OPTIONS));
app.use(morgan('dev'));





mongoose.connect('mongodb://localhost/test1', { useNewUrlParser: true })
	.then(console.log('connected to mongodb'))
	.catch(err => console.log(err));

const players = require('./routes/players');
app.use('/api/players', players);


const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));


