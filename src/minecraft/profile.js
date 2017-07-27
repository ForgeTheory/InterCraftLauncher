const stringArgv = require('string-argv');

const config = require('../config');

class Profile {

	constructor(key, profileJson) {
		this._profileKey = key;
		this._profile = profileJson;

		if (this._profileKey == undefined) {
			this.generateKey();
		}

		if (this._profile == undefined) {
			this._profile = {};
		}
	}

	/**
	 * Get the JSON representation of the profile
	 * @return {Json Object}
	 */
	json() {
		var result = {};
		var keys = Object.keys(this._profile);


		for (var i = 0; i < keys.length; i++)
			if (this._profile[keys[i]] != undefined)
				result[keys[i]] = this._profile[keys[i]];

		return result;
	}

	/**
	 * Get the profile key
	 * @return {String}
	 */
	key() {
		return this._profileKey;
	}

	/**
	 * Generate a profile key
	 * @return {String}
	 */
	generateKey() {
		this._profileKey = '';
		var chars = '0123456789abcdef';
		for (var i = 0; i < 32; i++)
			this._profileKey += chars[Math.floor(Math.random()*16)];
	}

	/**
	 * Get the display name
	 * @return {String|Null}
	 */
	displayName() {
		if (this._profile.name != undefined)
			return this._profile.name;

		if (this._profile.type != undefined) {
			if (this._profile.type == 'latest-release')
				return "Latest Release";
			else if (this._profile.type == 'latest-snapshot')
				return "Latest Snapshot";
		}

		if (this._profile.lastVersionId != undefined)
			return this._profile.lastVersionId;

		return null;
	}

	/**
	 * Get the name of the profile
	 * @return {String}
	 */
	name() { return this._profile.name; }

	/**
	 * Set the name of the profile
	 * @param {String} name
	 * @return {this}
	 */
	setName(name) {
		this._profile.name = name;
		return this;
	}

	/**
	 * Get the icon of the profile
	 * @return {String}
	 */
	icon() { return this._profile.icon; }

	/**
	 * Set the icon of the profile
	 * @param {String} icon
	 * @return {this}
	 */
	setIcon(icon) {
		this._profile.icon = icon;
		return this;
	}

	/**
	 * Get the type of profile
	 * @return {String|Undefined}
	 */
	type() { return this._profile.type; }

	/**
	 * Set the profile type <latest-release, latest-snapshot, custom>
	 * @param {String} type
	 * @return {this}
	 */
	setType(type) {
		this._profile.type = type;
		return this;
	}

	/**
	 * Get the date the profile was created
	 * @return {String} [description]
	 */
	created() { return this._profile.created; }

	/**
	 * Set the date the profile was created
	 * @param {String} type
	 * @return {this}
	 */
	setCreated(date) {
		if (date == undefined)
			date = new Date(Date.now());
		this._profile.created = date.toISOString();
		return this;
	}

	/**
	 * Get the date last used
	 * @return {String}
	 */
	lastUsed() { return this._profile.lastUsed; }

	/**
	 * Set the date last used
	 * @param {String} type
	 * @return {this}
	 */
	setLastUsed(date) {
		if (date == undefined)
			date = new Date(Date.now());
		this._profile.lastUsed = date.toISOString();
		return this;
	}

	/**
	 * Get the Minecraft version
	 * @return {String}
	 */
	version() { return this._profile.lastVersionId; }

	/**
	 * Set the Minecraft version
	 * @param {String} version
	 * @return {this}
	 */
	setVersion(version) {
		this._profile.lastVersionId = lastVersionId;
		return this;
	}

	/**
	 * Get the game directory
	 * @return {String}
	 */
	gameDirectory() {
		if (this._profile.gameDir)
			return this._profile.gameDir;
		return config.minecraftPath().path();
	}

	/**
	 * Set the game directory
	 * @param {String} gameDir
	 * @return {this}
	 */
	setGameDirectory(gameDir) {
		this._profile.gameDir = gameDir;
		return this;
	}

	/**
	 * Get the Java directory
	 * @return {String}
	 */
	javaPath() {
		if (this._profile.javaDir)
			return this._profile.javaDir;
		return config.javaPath().path();
	}

	/**
	 * Set the Java directory
	 * @param {String} javaDir
	 * @return {this}
	 */
	setJavaPath(javaDir) {
		this._profile.javaDir = javaDir;
		return this;
	}

	/**
	 * Get the java arguments
	 * @return {Array}
	 */
	javaArgs() {
		if (this._profile.javaArgs)
			return stringArgv(this._profile.javaArgs);
		return [];
	}

	/**
	 * Get the java arguments
	 * @return {String}
	 */
	javaArgsString() { return this._profile.javaArgs; }

	/**
	 * Set the java arguments
	 * @param {String} javaArgs
	 * @return {this}
	 */
	setJavaArgs(javaArgs) {
		this._profile.javaArgs = javaArgs;
		return this;
	}
}

// Make class visible outside
exports.Profile = Profile;
