

class MinecraftAccount
{
	/**
	 * Create a Minecraft account instance
	 * @param {Json Object} data
	 */
	constructor(data) {
		this._accessToken = data.accessToken;
		this._accountId   = data.accountId;
		this._email       = data.email;
		this._username    = data.username;
		this._uuid        = data.uuid;
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

	/**
	 * Get the username
	 * @return {String}
	 */
	username() { return this._username; }

	/**
	 * Get the UUID
	 * @return {String}
	 */
	uuid() { return this._uuid; }

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

	/**
	 * Set the username
	 * @param {String} username
	 * @return {This}
	 */
	setUsername(username) {
		this._username = username;
		return this;
	}

	/**
	 * Set the UUID
	 * @param {String} uuid
	 * @return {This}
	 */
	setUuid(uuid) {
		this._uuid = uuid;
		return this;
	}	
}

// Export the module
module.exports = {MinecraftAccount};