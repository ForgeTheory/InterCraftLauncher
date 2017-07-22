const got = require('got');

const Account = require('./account').Account;

const AUTH_URL = 'https://authserver.mojang.com';
const TIMEOUT = 10000; // 10 seconds

exports.authenticate = function(email, password, clientToken, callback) {
	console.log("Authenticating Minecraft account...");
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