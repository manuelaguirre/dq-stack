module.exports = function(err, req, res, next) {
	if(!res.statusCode){
		res.status(500);
	}
	res.send(err.message);
	console.log(err);
};