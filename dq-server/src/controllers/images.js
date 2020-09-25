const fs = require('fs'); 
const path = require('path');
const { getQuestionAndUpdate } = require('./questions');
const mongoose = require('mongoose');
const mongodb = require('mongodb');


async function uploadImage(req) {
	
	let questionID = req.body.questionID;
	let readablePhotoStream;
	try {
		readablePhotoStream = fs.createReadStream(path.join('src/uploads/' + req.file.filename));		
	} catch (error) {
		throw new Error('Error reading file. Be sure to include a field called image with a file attachment and set header to multipart/form-data');
	}

	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {
		bucketName: 'images'
	});
	
	let uploadStream = bucket.openUploadStream(req.file.originalname, { metadata: {questionID}});
	let id = uploadStream.id;
	readablePhotoStream.pipe(uploadStream);
	
	uploadStream.on('error', () => {
		throw new Error('Error uploading files');
	});
	
	uploadStream.on('finish', () => {
		return; //updatedQuestion;
	});
	return getQuestionAndUpdate(questionID, {image : id}); 
}

async function downloadImage(req, callbackOnError, callbackOnData, callbackOnEnd) {
	
	let imageID;
	try {
		imageID = new mongodb.ObjectID(req.params.id);
	} catch(err) {
		throw new Error('Invalid image ID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters'); 
	}
	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {
		bucketName: 'images'
	});
  
	let downloadStream = bucket.openDownloadStream(imageID);
 
	downloadStream.on('data', (chunk) => {
		callbackOnData(chunk);
	});
 
	downloadStream.on('error', (err) => {
		callbackOnError(err);
	});

	downloadStream.on('end', () => {
		callbackOnEnd();
	});	
}

async function deleteImage(req){
	let imageID;
	try {
		imageID = new mongodb.ObjectID(req.params.id);
	} catch(err) {
		throw new Error('Invalid image ID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters'); 
	}
	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {
		bucketName: 'images'
	});

	bucket.delete(imageID, (error)=>{
		if (error){
			throw new Error(error);
		}
	});
}

module.exports = {
	uploadImage,
	downloadImage,
	deleteImage
};

