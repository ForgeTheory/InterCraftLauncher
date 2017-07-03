const got = require('got');
const config = require('./config');

const DOMAIN = "https://intercraftmc.com/auth";
const TIMEOUT = 10000

var isSignedIn = false;
var accessToken;

exports.init = function() {
	accessToken = config.accessToken();
};

exports.isOnline = function(callback) {
	console.log("Checking if the server is online...");
	got.get(DOMAIN + '/status', {
		'timeout': TIMEOUT
	}).then(response => {
		callback(response.statusCode == 200);
	}); 
};

exports.isLoggedIn = function() {
	return isSignedIn;
};

exports.login = function(email, password, remember, callback) {
	console.log("Requesting access token with the given credentials");
	got.post(DOMAIN + '/login', {
		form: true,
		json: true,
		body: {
			'email': email,
			'password': password
		},
		timeout: TIMEOUT
	})
	.then(response => {
		accessToken = response.body.access_token;
		config.setAccessToken(response.statusCode == 200 && remember ? response.body.access_token : null);
		isSignedIn = response.statusCode == 200;
		callback({
			'isValid': response.statusCode == 200,
			'errorCode': response.statusCode
		});
	})
	.catch(error => {
		callback({
			'isValid': false,
			'errorCode': error.statusCode
		});
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
		},
		timeout: TIMEOUT
	}).then(response => {
		callback(response.statusCode == 200 ? response.body : null);
	}).catch(error => {
		callback(null);
	});
};