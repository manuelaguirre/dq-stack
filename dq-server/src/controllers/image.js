const fs = require('fs'); 
const path = require('path');
const { getQuestionAndUpdate, getImageID } = require('./questions');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

async function uploadImage(req) {
	let questionID = req.params.questionID;

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
	return bucket.delete(imageID);
}

async function updateImage(req){
	const oldImageID = await getImageID(req.params.questionID);
	const result = await uploadImage(req);
	await deleteImage(oldImageID);
	return result;
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
	getFilename,
	updateImage
};
