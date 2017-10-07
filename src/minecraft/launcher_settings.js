const _        = require("underscore");
const {Locale} = require("../core/locale");


class LauncherSettings
{
	/**
	 * Create new launcher settings
	 * @param  {Json Object} settings
	 */
	constructor(settings) {
		this._data = {};
		this.setAdvancedEnabled(settings.enableAdvanced);
		this.setAnalyticsEnabled(settings.enableAnalytics);
		this.setCrashAssistance(settings.crashAssistance);
		this.setKeepLauncherOpen(settings.keepLauncherOpen);
		this.setLocale(settings.locale);
		this.setShowGameLog(settings.showGameLog);
		this.setShowMenu(settings.showMenu);
	}

	/**
	 * Return the settings in Json format
	 * @return {Json Object}
	 */
	json() {
		var result = _.extend({}, this._data);
		return result;
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Check if advanced mode is enabled
	 * @return {Boolean}
	 */
	isAdvancedEnabled() { return this._data.enableAdvanced; }

	/**
	 * Check if analytics are enabled
	 * @return {Boolean}
	 */
	isAnalyticsEnabled() { return this._analyticsEnabled; }

	/**
	 * Check if crash assistance is enabled
	 * @return {Boolean}
	 */
	isCrashAssistance() { return this._data.crashAssistance; }

	/**
	 * Check if the launcher should be kept open upon launch
	 * @return {Boolean}
	 */
	keepLauncherOpen() { return this._data.keepLauncherOpen; }

	/**
	 * Get the locale name
	 * @return {String}
	 */
	locale() { return this._data.locale; }
	
	/**
	 * Check if the game log should be displayed
	 * @return {Boolean}
	 */
	showGameLog() { return this._data.showGameLog; }

	/**
	 * Check if the menu should be shown
	 * @return {Boolean}
	 */
	showMenu() { return this._data.showMenu; }

	// Mutators ----------------------------------------------------------------

	/**
	 * Set advanced mode enabled
	 * @return {This}
	 */
	setAdvancedEnabled(enabled) {
		this._data.enableAdvanced = Boolean(enabled);
		return this;
	}

	/**
	 * Set analytics enabled
	 * @return {This}
	 */
	setAnalyticsEnabled(enabled) {
		this._analyticsEnabled = Boolean(enabled);
		return this;
	}

	/**
	 * Set crash assistance enabled
	 * @return {This}
	 */
	setCrashAssistance(enabled) {
		this._data.crashAssistance = Boolean(enabled);
		return this;
	}

	/**
	 * Set if the launcher should be kept open upon launch
	 * @return {This}
	 */
	setKeepLauncherOpen(enabled) {
		this._data.keepLauncherOpen = Boolean(enabled);
		return this;
	}

	/**
	 * Set the locale name
	 * @return {This}
	 */
	setLocale(locale) {
		this._data.locale = locale;
		return this;
	}
	
	/**
	 * Set if the game log should be displayed
	 * @return {This}
	 */
	setShowGameLog(enabled) {
		this._data.showGameLog = Boolean(enabled);
		return this;
	}

	/**
	 * Set if the menu should be shown
	 * @return {This}
	 */
	setShowMenu(enabled) {
		this._data.showMenu = Boolean(enabled);
		return this;
	}
}

// Export the module
module.exports = {LauncherSettings};