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

	// Methods -----------------------------------------------------------------

	/**
	 * Determine if the profile is valid
	 * @return {Undefined}
	 */
	isValid() {
		return utils.isMinecraftIdentifier(this._uuid) &&
		       utils.isValidMinecraftUsername(this._username);
	}

	/**
	 * Render the profile in Json format
	 * @return {Json Object}
	 */
	json() {
		return {
			displayName: this._username
		}
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
module.exports = {AccountProfile};