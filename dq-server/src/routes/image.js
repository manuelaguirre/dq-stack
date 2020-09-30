const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const asyncCatch = require('../middleware/asyncCatch');
const { uploadImage, downloadImage, deleteImage, getFilename, updateImage } = require('../controllers/image');
const { questionHasImage, getImageID } = require('../controllers/questions');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');
const router = express.Router({mergeParams:true});
router.use(express.json());

const storage = multer.diskStorage({ 
	destination: (req, file, cb) => { 
		cb(null, 'src/uploads'); 
	}, 
	filename: (req, file, cb) => { 
		cb(null, file.originalname); 
	} 
}); 

const upload = multer({ storage: storage });

router.get('/', asyncCatch(async (req, res) => {
	const questionID = castToObjectID(req.params.questionID);
	const imageID = await getImageID(questionID);
	if (!imageID) {
		res.status(404);
		throw new Error('Image not found');
	}
	await downloadImage(imageID, () => {
		res.send('Image not found').status(404);
	}, (chunk) => {	
		res.write(chunk);
	}, () => {
		res.end();
	});
	const filename = await getFilename(imageID, 'images.files');
	const extension = path.extname(filename).slice(1);
	res.set('content-type', `image/${extension}`);
}));

router.put('/', upload.single('image'), auth, asyncCatch(async (req, res) => {
	const questionID = castToObjectID(req.params.questionID);
	let result;
	if (await questionHasImage(questionID)) {
		result = await updateImage(req);
		res.status(200);
	} else {
		result = await uploadImage(req);
		res.status(201);
	}
	return res.send(result);   
}));

function castToObjectID(id) {
	try {
		return new ObjectID(id);	
	} catch(err) {
		throw new Error('Invalid ID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters'); 
	}
}

module.exports = router;
