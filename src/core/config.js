const jetpack  = require("fs-jetpack");
const jsonfile = require("jsonfile");
const findJava = require("../utils/find_java");
const utils    = require("../utils/utils");

const CONFIG_FILE = "./config.json";

class Config
{
	/**
	 * Verify the given configuration fields are valid
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static check(callback) {

	}
	/**
	 * Generate a new configuration
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static generate(callback) {
		findJava((err, path) => {
			console.log("Found the path", path);
		});
		this._config = {

		}
		this.save(callback);
	}
	/**
	 * Initialize the configuration
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static init(callback) {
		console.log("Configuration initializing...");
		this._config = {};
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
				return this.generate(callback)
			else {
				this._config = obj;
				this.check(callback);
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
			(err) => { callback(Boolean(err)); });
	}
}

// Export the module
module.exports = {Config}
