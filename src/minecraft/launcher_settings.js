const _        = require("underscore");
const {Locale} = require("../core/locale");


class LauncherSettings
{
	/**
	 * Create new launcher settings
	 * @param  {Json Object} settings
	 */
	constructor(settings) {
		var defaults = {
			crashAssistance:  true,
			enableAdvanced:   true,
			enableAnalytics:  true,
			keepLauncherOpen: true,
			locale:           Locale.name().toLowerCase(),
			showGameLog:      false,
			showMenu:         true
		};
		this._data = _.defaults(settings, defaults);
	}

	/**
	 * Return the settings in Json format
	 * @return {Json Object}
	 */
	toJson() {
		return {
			crashAssistance:  this._data.crashAssistance,
			enableAdvanced:   this._data.enableAdvanced,
			enableAnalytics:  this._data.enableAnalytics,
			keepLauncherOpen: this._data.keepLauncherOpen,
			locale:           this._data.locale,
			showGameLog:      this._data.showGameLog,
			showMenu:         this._data.showMenu
		};
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Check if advanced mode is enabled
	 * @return {Boolean}
	 */
	advancedEnabled() { return this._data.enableAdvanced; }

	/**
	 * Check if analytics are enabled
	 * @return {Boolean}
	 */
	analyticsEnabled() { return this._analyticsEnabled; }

	/**
	 * Check if crash assistance is enabled
	 * @return {Boolean}
	 */
	crashAssistance() { return this._data.crashAssistance; }

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
		this._data.enableAdvanced = enabled;
		return this;
	}

	/**
	 * Set analytics enabled
	 * @return {This}
	 */
	setAnalyticsEnabled(enabled) {
		this._analyticsEnabled = enabled;
		return this;
	}

	/**
	 * Set crash assistance enabled
	 * @return {This}
	 */
	setCrashAssistance(enabled) {
		this._data.crashAssistance = enabled;
		return this;
	}

	/**
	 * Set if the launcher should be kept open upon launch
	 * @return {This}
	 */
	setKeepLauncherOpen(enabled) {
		this._data.keepLauncherOpen = enabled;
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
		this._data.showGameLog = enabled;
		return this;
	}

	/**
	 * Set if the menu should be shown
	 * @return {This}
	 */
	setShowMenu(enabled) {
		this._data.showMenu = enabled;
		return this;
	}
}

// Export the module
module.exports = {LauncherSettings};