class Account
{
	/**
	 * Create a new InterCraft Account instance
	 * @param  {Json Object} data
	 */
	constructor(data) {
		this._data = data;
	}

	/**
	 * Get the authentication token
	 * @return {String|Undefined}
	 */
	token() { return this._data.token; }
}

// Export the module
module.exports = {Account};