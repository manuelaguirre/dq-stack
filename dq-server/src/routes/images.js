const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const asyncCatch = require('../middleware/asyncCatch');
const { uploadImage, downloadImage, deleteImage } = require('../controllers/images');
const { uploadImageSchema } = require('../validation/input');
const { questionHasImage } = require('../controllers/questions');
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

router.get('/:id', auth, asyncCatch(async (req, res) => { 
	await downloadImage(req, () => {
		res.sendStatus(404).message();
	}, (chunk) => {	
		res.write(chunk);
	}, () => {
		res.end();
	});
	res.set('content-type', 'image/png');
	res.set('accept-ranges', 'bytes');
}));

router.post('/', upload.single('image'), auth, asyncCatch(async (req, res) => {
	let result = uploadImageSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	try {
		if (questionHasImage(req.body.questionID)){
			throw new Error('Failed to upload image, question already has an image associated to it. Please use PUT method');
		}
		result = await uploadImage(req);	
	} catch (error) {
		return res.status(400).send(error.message);
	}
	return res.send(result);   
}));

router.put('/:id', upload.single('image'), auth, asyncCatch(async (req, res) => {
	const result = await uploadImage(req);
	deleteImage(req); 
	return res.send(result);   
}));





module.exports = router;
