const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const asyncCatch = require('../middleware/asyncCatch');
const { uploadImage } = require('../controllers/images');
const router = express.Router();
router.use(express.json());

const storage = multer.diskStorage({ 
	destination: (req, file, cb) => { 
		cb(null, 'src/uploads'); 
	}, 
	filename: (req, file, cb) => { 
		console.log(file, 'FILEEEEEEEEEEEEEEEEEEEEEEe');
		cb(null, file.originalname); 
	} 
}); 

const upload = multer({ storage: storage });
console.log(upload.single);

router.get('/', upload.single('image'), auth, asyncCatch(async (req, res) => { 
	const result = await uploadImage(req);
	res.set('content-type', 'image/png');
	res.set('accept-ranges', 'bytes');
	return res.send(result);   
}));

router.post('/', upload.single('image'), auth, asyncCatch(async (req, res) => { 
	const result = await uploadImage(req);
	return res.send(result);   
}));



module.exports = router;
