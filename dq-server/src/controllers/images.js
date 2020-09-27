const fs = require('fs'); 
const path = require('path');
const { getQuestionAndUpdate } = require('./questions');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

async function uploadImage(req) {
	let questionID = req.body.questionID;
	let ReadableImageStream;
	try {
		ReadableImageStream = fs.createReadStream(path.join('src/uploads/' + req.file.filename));		
	} catch (error) {
		throw new Error('Error reading file. Be sure to include a field called image with a file attachment and set header to multipart/form-data');
	}
	let bucket = getMongoBucket('images');
	let uploadStream = bucket.openUploadStream(req.file.originalname, { metadata: {questionID} });
	let id = uploadStream.id;
	ReadableImageStream.pipe(uploadStream);
	uploadStream.on('error', () => {
		throw new Error('Error uploading files');
	});
	uploadStream.on('finish', () => {
		return;
	});
	return getQuestionAndUpdate(questionID, {image : id}); 
}

async function downloadImage(imageID, callbackOnError, callbackOnData, callbackOnEnd) {
	let bucket = getMongoBucket('images');
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

async function deleteImage(imageID){
	let bucket = getMongoBucket('images');
	bucket.delete(imageID, (error)=>{
		if (error){
			throw new Error(error);
		}
	});
}

function getMongoBucket(bucketName) {
	const db = mongoose.connection.db;
	let bucket = new mongodb.GridFSBucket(db, {bucketName});
	return bucket;
}

async function getFilename(_id, collectionName){
	const collection = mongoose.connection.db.collection(collectionName);
	const result = await collection.findOne({'_id' : _id});
	return result.filename;	
}

module.exports = {
	uploadImage,
	downloadImage,
	deleteImage,
	getFilename
};
