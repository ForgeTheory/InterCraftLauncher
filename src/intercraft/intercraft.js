const {Account}        = require("./account");
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
	constructor() {
		this._account = null;
	}

	/**
	 * Get the current InterCraft account
	 * @return {Account}
	 */
	account() { return this._account; }

	// Web Service Methods -----------------------------------------------------

	/**
	 * Send a patch request to the InterCraft web services
	 * @param  {String}        uri
	 * @param  {Json Object}   data
	 * @param  {Function}      callback
	 * @return {Undefined}
	 */
	patch(uri, data, callback) {
		NetworkManager.patch(BASE_URI + uri, data, {json: true}, (response) => {
			callback(response);
		});
	}

	/**
	 * Check the status of the InterCraft web services
	 * @param  {Function} callback
	 * @return {Boolean}
	 */
	status(callback) {
		NetworkManager.get(`${BASE_URI}/status`, null, null, (response) => {
			callback(response.statusCode == 200);
		});
	}

	/**
	 * Sign into an InterCraft account
	 * @param  {String} email
	 * @param  {String} password
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	login(email, password, callback) {
		this.patch("/login", {email: email, password: password}, (response) => {
			if (response.statusCode == 200) {
				this._account = new Account(response.body)
				callback(this._account);
			} else
				callback(null);
		});
	}

	/**
	 * Sign into an InterCraft account
	 * @param  {String}   email
	 * @param  {String}   password
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	logout(callback) {
		if (this._account == null) {
			callback();
			return;
		}
		this.patch("/logout", {"token": this._account.token()}, (response) => {
			this._account = null;
			callback(response.statusCode == 200);
		});
	}

	/**
	 * Set a new password for the current InterCraft account
	 * @param  {String}   currentPassword
	 * @param  {String}   newPassword
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	setPassword(currentPassword, newPassword, callback) {
		this.patch(
			"/password_set",
			{
				"token"       : this._account.token(),
				"password"    : currentPassword,
				"new_password": newPassword
			},
			(response) => {
				callback(response.statusCode == 200);
			}
		);
	}
}

// Export the module
module.exports = {InterCraft};
