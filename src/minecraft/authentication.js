const got = require('got');

const {Account} = require('./account');

const AUTH_URL = 'https://authserver.mojang.com';
const TIMEOUT = 10000; // 10 seconds

/**
 * Authenticate the given Minecraft login info
 * @param  {String}   email
 * @param  {String}   password
 * @param  {String}   clientToken
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.authenticate = function(email, password, clientToken, callback) {
	got.post(AUTH_URL + '/authenticate', {
		json: true,
		body: {
			"agent": {
				"name": "Minecraft",
				"version": 1
			},
			"username": email,
			"password": password,
			"clientToken": clientToken,
			"requestUser": true
		},
		timeout: TIMEOUT
	})
	.then(response => {
		if (response.statusCode == 200) {
			console.log("Minecraft authenticated successfully!");
			var account = new Account();
			account.setAccessToken(response.body.accessToken);
			account.setEmail(email.toLowerCase());
			account.setUserId(response.body.user.id);
			account.setUsername(response.body.selectedProfile.name);
			account.setUuid(response.body.selectedProfile.id);
			return callback(account);
		}
		callback(null);
	})
	.catch(error => {
		console.log("The response is invalid", error);
		callback(null);
	});
};

/**
 * Validate the given account
 * @param  {Account}  account
 * @param  {String}   clientToken
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.validate = function(account, clientToken, callback) {
	console.log(account.accessToken(), clientToken);
	got.post(AUTH_URL + '/validate', {
		json: true,
		body: {
			"accessToken": account.accessToken(),
			"clientToken": clientToken
		},
		timeout: TIMEOUT
	})
	.then(response => {
		callback(response.statusCode == 204);
	})
	.catch(error => {
		console.log("The given access token is invalid", error);
		callback(false);
	});
};

/**
 * Refresh the given (valid) access token
 * @param  {Account}  account
 * @param  {String}   clientToken
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.refresh = function(account, clientToken, callback) {
	got.post(AUTH_URL + '/refresh', {
		json: true,
		body: {
			"accessToken": account.accessToken(),
			"clientToken": clientToken,
		},
		timeout: TIMEOUT
	})
	.then(response => {
		console.log("The token has been refreshed to", response.body.accessToken);
		if (response.statusCode == 200)
			account.setAccessToken(response.body.accessToken);
		callback(response.statusCode == 200);
	})
	.catch(error => {
		console.log("The response is invalid", error);
		callback(false);
	});
};
