const async    = require("async");
const jetpack  = require("fs-jetpack");
const jsonfile = require("jsonfile");
const process  = require("process");
const _        = require("underscore");
const findJava = require("../utils/find_java");
const utils    = require("../utils/utils");

const CONFIG_FILE = "./data/config.json";

class Config
{
	/**
	 * Verify the given configuration fields are valid
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static check(callback) {
		callback(null);
	}
	/**
	 * Generate a new configuration
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static generate(callback) {
		this._config = this._config || {};
		async.parallel({
			java: (cb) => { findJava(cb); },
			minecraft: (cb) => { this.findMinecraft(cb); }
		}, (err, result) => {
			this._config = _.defaults(this._config, result);
			this.save(callback);
		});
	}
	/**
	 * Initialize the configuration
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static init(callback) {
		console.log("Configuration initializing...");
		this.load(callback);
	}

	/**
	 * Read the configuration from disk, otherwise generate one
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static load(callback) {
		jsonfile.readFile(CONFIG_FILE, {throws: false}, (err, obj) => {
			if (err)
				this.generate(callback)
			else {
				this._config = obj;
				this.generate(callback); // Add any missing config properties
			}
		});
	}

	/**
	 * Write the configuration to disk
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static save(callback) {
		jsonfile.writeFile(
			CONFIG_FILE,
			this._config,
			{
				spaces: 2,
				thows: false
			},
			(err) => { if (callback) callback(err); }
		);
	}

	// Generation Methods ------------------------------------------------------

	static findMinecraft(callback) {
		var path;
		if (process.platform == "win32") {
			path = jetpack.cwd(process.env.APPDATA)
			              .path(".minecraft");
		}
		else if (process.platform == "darwin") {
			path = jetpack.cwd(process.env.HOME)
			              .path("Library/Application Support/minecraft");
		}
		else {
			path = jetpack.cwd(process.env.HOME)
			              .path(".minecraft");
		}
		callback(null, path);
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get the locale
	 * @return {String}
	 */
	static locale() {
		return this._config.locale || null;
	}

	// Mutators ----------------------------------------------------------------

	/**
	 * Set the locale
	 * @param {String} locale
	 * @return {Undefined}
	 */
	static setLocale(locale) {
		this._config.locale = locale;
	}
}

// Export the module
module.exports = {Config}
