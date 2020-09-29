const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const asyncCatch = require('../middleware/asyncCatch');
const { uploadImage, downloadImage, deleteImage, getFilename } = require('../controllers/images');
const { uploadImageSchema } = require('../validation/input');
const { questionHasImage } = require('../controllers/questions');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');
const router = express.Router();
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

router.get('/:id', asyncCatch(async (req, res) => {
	let imageID = castToObjectID(req.params.id);
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

router.post('/', upload.single('image'), auth, asyncCatch(async (req, res) => {
	let result = uploadImageSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	if (await questionHasImage(req.body.questionID)){
		throw new Error('Failed to upload image, question already has an image associated to it. Please use PUT method');
	}
	result = await uploadImage(req);	
	return res.send(result);   
}));

router.put('/:id', upload.single('image'), auth, asyncCatch(async (req, res) => {
	const result = await uploadImage(req);
	const deletedImageID = castToObjectID(req.params.id);
	deleteImage(deletedImageID); 
	return res.send(result);   
}));

function castToObjectID(id) {
	try {
		return new ObjectID(id);	
	} catch(err) {
		throw new Error('Invalid image ID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters'); 
	}
}

module.exports = router;
