const utils = require('../utils/utils');

class Account {
	constructor(userJson, remember = true) {
		this._userData = userJson || {};
		this._remember = remember;
	}

	/**
	 * Get the account in JSON format
	 * @return {Json Object}
	 */
	json(legacy) {
		if (legacy === true)
			return this.legacyJson();

		var profiles = {};
		profiles[this._userData.uuid] = {
			displayName: this._userData.username
		};

		return {
			accessToken: this._userData.accessToken,
			username: this._userData.email,
			profiles: profiles
		};
	}

	/**
	 * Get the account in legacy JSON format
	 * @return {Json Object}
	 */
	legacyJson() {
		return {
			displayName: this._userData.username,
			accessToken: this._userData.accessToken,
			userid: this._userData.userId,
			uuid: utils.partitionToken(this._userData.uuid),
			username: this._userData.email
		};
	}

	/**
	 * Get the access token
	 * @return {String}
	 */
	accessToken() { return this._userData.accessToken; }

	/**
	 * Set the access token
	 * @param {String} accessToken
	 */
	setAccessToken(accessToken) {
		this._userData.accessToken = accessToken;
		return this;
	}

	/**
	 * Get the email address
	 * @return {String}
	 */
	email() { return this._userData.email; }

	/**
	 * Set the email address
	 * @param {String} email
	 */
	setEmail(email) {
		this._userData.email = email
		return this;
	}

	/**
	 * Get the username/display name
	 * @return {String}
	 */
	username() { return this._userData.username; }

	/**
	 * Set the username/display name
	 * @param {String} username
	 */
	setUsername(username) {
		this._userData.username = username;
		return this;
	}

	/**
	 * Get the UUID
	 * @return {String} [description]
	 */
	uuid() { return this._userData.uuid; }

	/**
	 * Set the UUID
	 * @param {String} uuid
	 */
	setUuid(uuid) {
		this._userData.uuid = uuid;
		return this;
	}

	/**
	 * Get the user ID
	 * @return {String}
	 */
	userId() { return this._userData.userId; }

	/**
	 * Set the user ID
	 * @param {String} userId
	 */
	setUserId(userId) {
		this._userData.userId = userId;
		return this;
	}

	/**
	 * 
	 * @return {[type]} [description]
	 */
	remember() {
		return this._remember;
	}

	/**
	 * Set whether or not the launcher should save the account
	 * @param {Boolean} remember
	 */
	setRemember(remember) {
		this._remember = remember;
		return this;
	}
}

// Make class visible outside
module.exports = {Account};