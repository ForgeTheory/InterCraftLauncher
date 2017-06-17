const got = require('got');
const config = require('./config');

const DOMAIN = "https://dev.intercraftmc.com/auth";

exports.isOnline = function(callback) {
	console.log("Checking if the server is online...");
	got.get(DOMAIN + '/status')
		.then(response => {
			callback(response.statusCode == 200);
		}); 
};

exports.login = function(email, password, callback) {
	console.log("Requesting access token with the given credentials");
	got.post(DOMAIN + '/login', {
		form: true,
		json: true,
		body: {
			'email': email,
			'password': password
		}
	}).then(response => {
		config.setAccessToken(response.statusCode == 200 ? response.body.access_token : null);
		callback({
			'isValid': response.statusCode == 200,
			'errorCode': response.body.error_code
		});
	}).catch(error => {
		callback(null);
	});
};

exports.fetchProfile = function(callback) {
	console.log(config.accessToken());
	console.log("Getting the profile from the access token");
	got.post(DOMAIN + '/profile', {
		form: true,
		json: true,
		body: {
			'access_token': config.accessToken()
		}
	}).then(response => {
		callback(response.statusCode == 200 ? response.body : null);
	}).catch(error => {
		callback(null);
	});
};