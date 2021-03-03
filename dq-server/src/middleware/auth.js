const jwt = require('jsonwebtoken');
const config = require('config');
const { getUser } = require('../controllers/users');

async function auth(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).send('Error. No authentication token provided');
	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).send('Invalid Token');
	}
}

function authorize(...roles) {
	return async function(req,res,next) {
		const token = req.header('x-auth-token');
		if (!token) return res.status(401).send('Error. No authentication token provided');
		try {
			const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
			const user = await getUser(decoded._id);
			if (!user) return res.status(404).send('Error. User not found');
			if (!roles.includes(user.role)) {
				return res.status(401).send('Error. Not enough permissions');
			}
			req.user = user;
			next();
		} catch (error) {
			return res.status(401).send('Invalid Token');
		}
	};
	
}

module.exports = { auth, authorize };