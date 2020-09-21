const {
	CORS_ORIGIN_HOST = 'http://localhost'
} = process.env;

const CORS_OPTIONS = {
	origin: '*', //change for prod
	methods:['GET','POST','PUT', 'PATCH', 'DELETE'],
	credentials: true,
};

module.exports.CORS_OPTIONS = CORS_OPTIONS;