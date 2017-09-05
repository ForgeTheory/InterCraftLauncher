const got = require('got');
const config = require('./config');

const errors = require('./errors');

const DOMAIN = "https://intercraftmc.com/launcher";
const TIMEOUT = 10000;

var profile = null;
var isSignedIn = false;

/**
 * Get the current InterCraft profile
 * @return {Json Object}
 */
exports.profile = function() {
	return profile
};

/**
 * Check if the authentication servers are online
 * @param  {Function} callback
 * @return {Boolean}
 */
exports.isOnline = function(callback) {
	console.log("Checking if the server is online...");
	got.get(DOMAIN + '/status', {
		'timeout': TIMEOUT
	}).then(response => {
		callback(response.statusCode == 200);
	}).catch(error => {
		callback(response.statusCode == 200);
	}); 
};

/**
 * Check if the user is currently logged in
 * @return {Boolean}
 */
exports.isLoggedIn = function() {
	return isSignedIn;
};

/**
 * Validate the token by updating the profile
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.authenticate = function(callback) {
	if (config.accessToken() && config.accessToken().length == 40)
		return exports.fetchProfile(callback);
	callback(false);
};

/**
 * Attempt to sign the user in
 * @param  {String}    email
 * @param  {String}    password
 * @param  {Boolean}   remember
 * @param  {Function}  callback
 * @return {Undefined}
 */
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

/**
 * Fetch the user's InterCraft profile
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.fetchProfile = function(callback) {
	console.log("Fetching InterCraft profile...");
	got.post(DOMAIN + '/profile', {
		form: true,
		json: true,
		body: {
			'access_token': config.accessToken()
		},
		timeout: TIMEOUT
	}).then(response => {
		isSignedIn = response.statusCode == 200;
		profile = isSignedIn ? response.body : null;
		callback(isSignedIn);
	}).catch(error => {
		console.log(error);
		callback(false);
	});
};