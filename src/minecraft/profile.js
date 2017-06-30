
class Profile {

	constructor(key, profileJson) {
		this.profileKey = key;
		this.profile = profileJson;

		if (this.profileKey == undefined) {
			this.generateKey();
		}

		if (this.profile == undefined) {
			this.profile = {};
		}
	}

	/**
	 * Get the JSON representation of the profile
	 * @return {Json Object}
	 */
	json() {
		var result = {};
		var keys = Object.keys(this.profile);


		for (var i = 0; i < keys.length; i++)
			if (this.profile[keys[i]] != undefined)
				result[keys[i]] = this.profile[keys[i]];

		return result;
	}

	/**
	 * Get the profile key
	 * @return {String}
	 */
	key() {
		return this.profileKey;
	}

	/**
	 * Generate a profile key
	 * @return {String}
	 */
	generateKey() {
		this.profileKey = '';
		var chars = '0123456789abcdef';
		for (var i = 0; i < 32; i++)
			this.profileKey += chars[Math.floor(Math.random()*16)];
	}

	/**
	 * Get the display name
	 * @return {String|Null}
	 */
	displayName() {
		if (this.profile.name != undefined)
			return this.profile.name;

		if (this.profile.type != undefined) {
			if (this.profile.type == 'latest-release')
				return "Latest Release";
			else if (this.profile.type == 'latest-snapshot')
				return "Latest Snapshot";
		}

		if (this.profile.lastVersionId != undefined)
			return this.profile.lastVersionId;

		return null;
	}

	/**
	 * Get the name of the profile
	 * @return {String}
	 */
	name() { return this.profile.name; }

	/**
	 * Set the name of the profile
	 * @param {String} name
	 * @return {this}
	 */
	setName(name) {
		this.profile.name = name;
		return this;
	}

	/**
	 * Get the icon of the profile
	 * @return {String}
	 */
	icon() { return this.profile.icon; }

	/**
	 * Set the icon of the profile
	 * @param {String} icon
	 * @return {this}
	 */
	setIcon(icon) {
		this.profile.icon = icon;
		return this;
	}

	/**
	 * Get the type of profile
	 * @return {String|Undefined}
	 */
	type() { return this.profile.type; }

	/**
	 * Set the profile type <latest-release, latest-snapshot, custom>
	 * @param {String} type
	 * @return {this}
	 */
	setType(type) {
		this.profile.type = type;
		return this;
	}

	/**
	 * Get the date the profile was created
	 * @return {String} [description]
	 */
	created() { return this.profile.created; }

	/**
	 * Set the date the profile was created
	 * @param {String} type
	 * @return {this}
	 */
	setCreated(date) {
		if (date == undefined)
			date = new Date(Date.now());
		this.profile.created = date.toISOString();
		return this;
	}

	/**
	 * Get the date last used
	 * @return {String}
	 */
	lastUsed() { return this.profile.lastUsed; }

	/**
	 * Set the date last used
	 * @param {String} type
	 * @return {this}
	 */
	setLastUsed(date) {
		if (date == undefined)
			date = new Date(Date.now());
		this.profile.lastUsed = date.toISOString();
		return this;
	}

	/**
	 * Get the Minecraft version
	 * @return {String}
	 */
	version() { return this.profile.lastVersionId; }

	/**
	 * Set the Minecraft version
	 * @param {String} version
	 * @return {this}
	 */
	setVersion(version) {
		this.profile.lastVersionId = lastVersionId;
		return this;
	}

	/**
	 * Get the game directory
	 * @return {String}
	 */
	gameDirectory() { return this.profile.gameDir; }

	/**
	 * Set the game directory
	 * @param {String} gameDir
	 * @return {this}
	 */
	setGameDirectory(gameDir) {
		this.profile.gameDir = gameDir;
		return this;
	}

	/**
	 * Get the Java directory
	 * @return {String}
	 */
	javaPath() { return this.profile.javaDir; }

	/**
	 * Set the Java directory
	 * @param {String} javaDir
	 * @return {this}
	 */
	setJavaPath(javaDir) {
		this.profile.javaDir = javaDir;
		return this;
	}

	/**
	 * Get the java arguments
	 * @return {String}
	 */
	javaArgs() { return this.profile.javaArgs; }

	/**
	 * Set the java arguments
	 * @param {String} javaArgs
	 * @return {this}
	 */
	setJavaArgs(javaArgs) {
		this.profile.javaArgs = javaArgs;
		return this;
	}
}

// Make class visible outside
exports.Profile = Profile;