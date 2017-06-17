const intercraftAuth = require('./intercraft_auth');


exports.init = function() {
	intercraftAuth.isOnline((isOnline) => {
		console.log(isOnline);
	});
};