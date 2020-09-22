const fs = require('fs'); 
const path = require('path');
const config = require('config');
const { Image } = require('../db');
const { getQuestionAndUpdate } = require('./questions');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const { Readable } = require('stream');


async function uploadImage(req) {
	// const imageToAdd = new Image({
	// 	name: req.body.name, 
	// 	question: req.body.question, 
	// 	desc: req.body.desc, 
	// 	img: { 
	// 		data: fs.readFileSync(path.join('src/uploads/' + req.file.filename)), 
	// 		contentType: 'image/png'
	// 	} 
	// });
	// let result = await imageToAdd.save();
	// const updatedQuestion = await getQuestionAndUpdate(imageToAdd.question, {image : result._doc._id}); 
	console.log(req.file.filename);
	const readablePhotoStream = fs.createReadStream(path.join('src/uploads/' + req.file.filename));
	console.log(readablePhotoStream);

	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {
		bucketName: 'imagebucket'
	});
	
	let uploadStream = bucket.openUploadStream(req.body.name);
	let id = uploadStream.id;
	readablePhotoStream.pipe(uploadStream);

	uploadStream.on('data', (data)=>{
		console.log(data);
	});
	
	uploadStream.on('error', () => {
		throw new Error('Error uploading files');
	});
	
	uploadStream.on('finish', () => {
		console.log('finished file upload');
		return; //updatedQuestion;
	});
}

async function downloadImage(req,res) {
	
	try {
		var trackID = new ObjectID(req.params.trackID);
	} catch(err) {
		return res.status(400).json({ message: 'Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters' }); 
	}
	res.set('content-type', 'audio/mp3');
	res.set('accept-ranges', 'bytes');
 
	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {
		bucketName: 'imagebucket'
	});
  
	let downloadStream = bucket.openDownloadStream(trackID);
 
	downloadStream.on('data', (chunk) => {
		res.write(chunk);
	});
 
	downloadStream.on('error', () => {
		res.sendStatus(404);
	});

	downloadStream.on('end', () => {
		res.end();
	});
	
}

module.exports = {
	uploadImage
};

