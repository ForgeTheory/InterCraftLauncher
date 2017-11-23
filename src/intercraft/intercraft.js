const jetpack          = require("fs-jetpack");
const jsonfile         = require("jsonfile");
const {Account}        = require("./account");
const {NetworkManager} = require('../core/network_manager');

let DATA_FILE = "./data/intercraft.json";
let BASE_URI  = "https://intercraftmc.com/api";
let instance  = null;

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
		this._account = new Account();
	}

	/**
	 * Get the current InterCraft account
	 * @return {Account}
	 */
	account() { return this._account; }

	/**
	 * Load the saved InterCraft information
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	load(callback) {
		if (jetpack.exists(DATA_FILE)) {
			jsonfile.readFile(DATA_FILE, {throws: false}, (err, obj) => {
				obj = obj || {};
				if (!err) {
					this._account.setEmail(obj.email);
					this._account.setToken(obj.token);
					this._remember = Boolean(obj.email) && Boolean(obj.token);
				}
				if (callback)
					callback();
			});
		} else if (callback)
			callback();
	}

	/**
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	save(callback) {
		jsonfile.writeFile(
			DATA_FILE,
			{
				"email": this._remember ? this._account.email() : "",
				"token": this._remember ? this._account.token() : ""
			},
			{throws: false, spaces: 2},
			callback
		);
	}

	// Web Service Methods -----------------------------------------------------

	/**
	 * Send a GET request to the InterCraft web services
	 * @param  {String}      uri
	 * @param  {Json Object} data
	 * @param  {Function}    callback
	 * @return {Undefined}
	 */
	get(uri, data, callback) {
		if (typeof data == "function") {
			callback = data;
			data = null;
		}
		NetworkManager.get(BASE_URI + uri, data, {json: true}, callback);
	}

	/**
	 * Send a PATCH request to the InterCraft web services
	 * @param  {String}      uri
	 * @param  {Json Object} data
	 * @param  {Function}    callback
	 * @return {Undefined}
	 */
	patch(uri, data, callback) {
		if (typeof data == "function") {
			callback = data;
			data = null;
		}
		NetworkManager.patch(BASE_URI + uri, data, {json: true}, callback);
	}

	/**
	 * Validate an account's authentication token
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	authenticate(callback) {
		if (this._account.token())
			this.get(
				"/authenticate",
				{token: this._account.token()},
				(response) => {
					if (response.statusCode == 200) {
						this._account.update(response.body);
						this.save();
						callback(false);
					} else {
						this._account.update(null);
						this.save();
						callback(true);
					}
				}
			);
		else
			callback(true);
	}

	/**
	 * Check the status of the InterCraft web services
	 * @param  {Function} callback
	 * @return {Boolean}
	 */
	status(callback) {
		this.get("/status", (response) => {
			callback(response.statusCode != 200);
		});
	}

	/**
	 * Sign into an InterCraft account
	 * @param  {String} email
	 * @param  {String} password
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	login(email, password, remember, callback) {
		this.patch("/login", {email: email, password: password}, (response) => {
			if (response.statusCode == 200) {
				this._remember = remember;
				this._account.update(response.body);
				this.save();
				callback(false);
			} else {
				this._account.update(null);
				this.save();
				callback(true);
			}
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
			callback(false);
			return;
		}
		this.patch("/logout", {"token": this._account.token()}, (response) => {
			this._account.update(null);
			this.save();
			callback(response.statusCode != 200);
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
				"token":        this._account.token(),
				"password":     currentPassword,
				"new_password": newPassword
			},
			(response) => {
				callback(response.statusCode != 200);
			}
		);
	}
}

// Export the module
module.exports = {InterCraft};
