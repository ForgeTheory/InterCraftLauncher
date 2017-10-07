const validator        = require("validator");
const {AccountProfile} = require("./account_profile");
const utils            = require("../utils/utils");


class Account
{
	/**
	 * Create a Minecraft account instance
	 * @param {Json Object|Null} data
	 */
	constructor(data) {
		data = data || {};
		this._accessToken = data.accessToken;
		this._accountId   = data.accountId;
		this._email       = data.username;
		this._profiles    = [];
		for (var uuid in data.profiles) {
			this._profiles.push(new AccountProfile(
				data.profiles[uuid].displayName,
				uuid
			));
		}
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Determine if an account is in a valid format
	 * @return {Boolean}
	 */
	isValid() {
		try {
			var result = true;
			for (var i = 0; i < this._profiles.length; i++)
				result = result && this._profiles[i].isValid();
			return utils.isMinecraftIdentifier(this._accessToken) &&
			       utils.isMinecraftIdentifier(this._accountId) &&
			       validator.isEmail(this._email) &&
			       result;
		} catch(e) {
			return false;
		}
	}

	/**
	 * Render the account into a Json object
	 * @return {Json Object}
	 */
	json() {
		var profiles = {};
		for (var i = 0; i <  this._profiles.length; i++)
			profiles[this._profiles[i].uuid()] = this._profiles[i].json();
		return {
			accessToken: this._accessToken,
			username: this._email,
			profiles: profiles
		};
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get the access token
	 * @return {String}
	 */
	accessToken() { return this._accessToken; }

	/**
	 * Get the account ID
	 * @return {String}
	 */
	accountId() { return this._accountId; }

	/**
	 * Get the email address
	 * @return {String}
	 */
	email() { return this._email; }

	// Mutators ----------------------------------------------------------------

	/**
	 * Set the access token
	 * @param {String} accessToken
	 * @return {This}
	 */
	setAccessToken(accessToken) {
		this._accessToken = accessToken;
		return this;
	}

	/**
	 * Set the account ID
	 * @param {String} accountId
	 * @return {This}
	 */
	setAccountId(accountId) {
		this._accountId = accountId;
		return this;
	}

	/**
	 * Set the email address
	 * @param {String} email
	 * @return {This}
	 */
	setEmail(email) {
		this._email = email;
		return this;
	}
}

// Export the module
module.exports = {Account};