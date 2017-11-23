class Account
{
	/**
	 * Create a new InterCraft Account instance
	 * @param  {Json Object|Null} data
	 */
	constructor(data) {
		this._data = data || {};
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get the email address
	 * @return {String|Undefined}
	 */
	email() { return this._data.email; }

	/**
	 * Get the authentication token
	 * @return {String|Undefined}
	 */
	token() { return this._data.token; }

	// Mutators ----------------------------------------------------------------

	/**
	 * Set the email address
	 * @param {String} email
	 */
	setEmail(email) {
		this._data.email = email;
		return this;
	}

	/**
	 * Set the authentication token
	 * @param {String} token
	 */
	setToken(token) {
		this._data.token = token;
		return this;
	}

	/**
	 * Update the account's data
	 * @param  {Json Object||Null} data
	 * @return {Undefined}
	 */
	update(data) {
		this._data = data || {};
		return this;
	}
}

// Export the module
module.exports = {Account};
