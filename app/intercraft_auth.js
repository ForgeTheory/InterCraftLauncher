(function () {'use strict';

const needle = require('needle');
const config = require('./config');

const DOMAIN = "https://dev.intercraftmc.com/auth";

exports.isOnline = function(callback) {
	console.log("Checking if the server is online...");
	needle.get(DOMAIN + '/status', (err, resp) => {
		if (err)
			console.log("ERROR checking the server status", err);
		console.log("The server status is", resp.statusCode);
		callback(resp && resp.statusCode == 200);
	}); 
};

exports.login = function(email, password, callback) {
	console.log("Requesting access token with the given credentials");
	needle.post(DOMAIN + '/login', {
		'email': email,
		'password': password
	}, (err, resp, body) => {
		config.setAccessToken(resp.statusCode == 200 ? body.access_token : null);
		callback({
			'isValid': resp.statusCode == 200,
			'errorCode': body.error_code
		});
	});
};

exports.fetchProfile = function(callback) {
	console.log("Getting the profile from the access token");
	needle.post(DOMAIN + '/profile', {
		'access_token': config.accessToken()
	}, (err, resp, body) => {
		callback(resp.statusCode == 200 ? body : null);
	});
};

}());
//# sourceMappingURL=intercraft_auth.js.map