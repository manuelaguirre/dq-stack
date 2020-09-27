module.exports = function asyncCatch(handler) {
	return async (req, res, next) => {
		try {
			await handler(req, res);
		} catch (err) {
			next(err);
		}
	} ;
};