const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
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

module.exports = auth;