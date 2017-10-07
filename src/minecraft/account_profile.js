const utils = require("../utils/utils");


class AccountProfile
{
	/**
	 * Create a new Minecraft profile instance
	 * @param  {String} id
	 * @param  {String} username
	 * @param  {String} uuid
	 */
	constructor(username, uuid) {
		this._username = username;
		this._uuid     = uuid;
	}

	/**
	 * @todo query mojang to see if the profile is valid
	 * Determine if the profile is valid
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	isValid(callback) {
		if (utils.isMinecraftIdentifier(this._uuid)) {
			if (utils.isValidMinecraftUsername(this.__username)) {
				callback(true);
				return;
			}
		}
		callback(false);
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get the profile username
	 * @return {String}
	 */
	username() { return this._username; }

	/**
	 * Get the profile UUID
	 * @return {String}
	 */
	uuid() { return this._uuid; }

	// Method ------------------------------------------------------------------

	/**
	 * Set the profile username
	 * @param  {String} username
	 * @return {This}
	 */
	setUsername(username) {
		this._username = username;
		return this;
	}

	/**
	 * Set the profile UUID
	 * @param  {String} uuid
	 * @return {This}
	 */
	setUuid(uuid) {
		this._uuid = uuid;
		return this;
	}
}

// Export the module
module.exports = {Profile};