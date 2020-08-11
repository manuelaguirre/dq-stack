module.exports = function asyncCatch(handler) {
	return async (req, res, next) => {
		try {
			handler(req, res);
		} catch (ex) {
			next(ex);
		}
	} ;
};