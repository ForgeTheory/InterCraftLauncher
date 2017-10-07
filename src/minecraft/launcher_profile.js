

class LauncherProfile
{
	/**
	 * Create a new launcher profile instance
	 * @param {Json Object|Null} data
	 */
	constructor(key, data, legacy) {
		data = data || {};
		this.setCreationDate(dated.created);
		this.setIcon(data.icon);
		this.setGameDir(data.gameDir);
		this.setJavaArgs(data.javaArgs);
		this.setLastUsedDate(data.lastUsed);
		this.setName(legacy ? key : data.name);
		this.setType(data.type);
		this.setVersionId(data.lastVersionId);
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Convert the profile to Json
	 * @return {Json Object}
	 */
	json() {
		var result = {

		}
		return result;
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get the date the profile was created
	 * @return {String}
	 */
	creationDate() { return this._creationDate; }

	/**
	 * Get the profile's icon
	 * @return {String}
	 */
	icon() { return this._icon; }

	/**
	 * Get the profile's icon
	 * @return {String}
	 */
	gameDir() { return this._gameDir; }

	/**
	 * Get the profile's java arguments
	 * @return {String}
	 */
	javaArgs() { return this._javaArgs; }

	/**
	 * Get the profile's last used date
	 * @return {String}
	 */
	lastUsedDate() { return this._lastUsedDate; }

	/**
	 * Get the profile's name
	 * @return {String}
	 */
	name() { return this._name; }

	/**
	 * Get the profile's version type
	 * @return {String}
	 */
	type() { return this._type; }

	/**
	 * Get the profile's version ID
	 * @return {String}
	 */
	versionId() { return this._versionId; }

	// Mutators ----------------------------------------------------------------

	/**
	 * Get the date the profile was created
	 * @param  {String} creationDate
	 * @return {This}
	 */
	setCreationDate(creationDate) {
		this._creationDate = creationDate;
		return this;
	}

	/**
	 * Get the profile's icon
	 * @param  {String} icon
	 * @return {This}
	 */
	setIcon(icon) {
		this._icon = icon;
		return this;
	}

	/**
	 * Get the profile's game directory
	 * @param  {String} gameDir
	 * @return {This}
	 */
	setGameDir(gameDir) {
		this._gameDir = gameDir;
		return this;
	}

	/**
	 * Get the profile's java arguments
	 * @param  {String} javaArgs
	 * @return {This}
	 */
	setJavaArgs(javaArgs) {
		this._javaArgs = javaArgs;
		return this;
	}

	/**
	 * Get the date the profile was last used
	 * @param  {String} lastUsedDate
	 * @return {This}
	 */
	setLastUsedDate(lastUsedDate) {
		this._lastUsedDate = lastUsedDate;
		return this;
	}

	/**
	 * Get the profile's name
	 * @param  {String} name
	 * @return {This}
	 */
	setName(name) {
		this._name = name;
		return this;
	}

	/**
	 * Get the profile's type
	 * @param  {String} type
	 * @return {This}
	 */
	setType(type) {
		this._type = type;
		return this;
	}

	/**
	 * Get the profile's version ID
	 * @param  {String} versionId
	 * @return {This}
	 */
	setVersionId(versionId) {
		this._versionId = versionId;
		return this;
	}
}

// Export the module
module.exports = {LauncherProfile};