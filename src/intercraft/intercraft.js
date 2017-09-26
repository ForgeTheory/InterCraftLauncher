const {NetworkManager} = require('../core/network_manager');

let BASE_URI = "https://intercraftmc.com/api";
let instance = null;

class InterCraft
{
	/**
	 * Get the current InterCraft instance
	 * @return {InterCraft}
	 */
	static instance() {
		if (!instance)
			instance = new InterCraft();
		return instance;
	}
	/**
	 * Create a new instance to the InterCraft web services
	 */
	construct() {
		this._account = null;
	}
	/**
	 * Check the status of the InterCraft web services
	 * @param  {Function} callback
	 * @return {Boolean}
	 */
	status(callback) {
		NetworkManager.get(`${BASE_URI}/status`, null, null, (result) => {
			callback(result.statusCode == 200);
		});
	}
}

// Export the module
module.exports = {InterCraft};
