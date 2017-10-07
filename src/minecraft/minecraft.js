const jetpack                  = require("fs-jetpack");
const jsonfile                 = require("jsonfile");
const {LauncherSettings}       = require("./launcher_settings");
const {LauncherProfileManager} = require("./launcher_profile_manager");
const utils                    = require("../utils/utils");

const FILE_NAME        = "launcher_profiles.json";
const LAUNCHER_VERSION = {
	"profilesFormat": 2,
	"format":         20,
	"name":           "2.0.934"
};

class Minecraft
{
	/**
	 * Create a new launcher profile manager
	 */
	constructor(path) {
		this._path = jetpack.cwd(path).path(FILE_NAME);
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Generate and set a new client token
	 * @return {Undefined}
	 */
	generateClientToken(token) {
		if (token && utils.isHexStringPartitioned(token))
			this._clientToken = token;
		else
			this._clientToken = utils.randomHexStringPartitioned();
	}

	/**
	 * Load and parse the Minecraft launcher configuration
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	load(callback) {
		jsonfile.readFile(this._path, {throws: false}, (err, obj) => {
			if (err) {
				this.parse({}, callback);
			} else {
				if ((obj.launcherVersion || {}).format == 16) {
					this.parseLegacy(obj, callback);
				} else {
					this.parse(obj, callback);
				}
			}
		});
	}

	/**
	 * Write the Minecraft launcher configuration to disk
	 * @param {Function} callback
	 * @return {Undefined}
	 */
	save(callback) {
		var obj = {
			settings:        this._settings.toJson(),
			launcherVersion: LAUNCHER_VERSION,
			clientToken:     this._clientToken
		};
		jsonfile.writeFile(
			this._path,
			obj,
			{throws: false, spaces: 2},
			(err) => {
				callback(err);
			}
		);
	}

	/**
	 * Parse the given configuration using the newest format
	 * @param  {Json Object} obj
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	parse(obj, callback) {
		this._settings           = new LauncherSettings(obj.settings);
		this._profiles           = new LauncherProfileManager(config.profiles);
		this._analyticsFailcount = config.analyticsFailcount || 0;
		this._analyticsToken     = config.analyticsToken || "";
		this.generateClientToken(config.clientToken);
		this.save(callback);
	}

	/**
	 * Parse the given configuration using the legacy format
	 * @param  {Json Object} obj
	 * @return {Undefined}
	 */
	parseLegacy(obj, callback) {
		this._settings = new LauncherSettings(obj.settings);
	}

	// Accessors ---------------------------------------------------------------

	accounts() { return this._accounts; }

	activeAccount() {  }

	// Mutators ----------------------------------------------------------------

	

}

// Export the module
module.exports = {Minecraft};