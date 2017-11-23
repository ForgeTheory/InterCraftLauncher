const _        = require("underscore");
const {Locale} = require("../core/locale");


class LauncherSettings
{
	/**
	 * Create new launcher settings
	 * @param  {Json Object} settings
	 */
	constructor(settings) {
		settings = settings || {};
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
	isAnalyticsEnabled() { return this._data.analyticsEnabled; }

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
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setAdvancedEnabled(enabled) {
		if (enabled == undefined)
			this._data.enableAdvanced = true;
		else
			this._data.enableAdvanced = Boolean(enabled);
		return this;
	}

	/**
	 * Set analytics enabled
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setAnalyticsEnabled(enabled) {
		if (enabled == undefined)
			this._data.enableAnalytics = false;
		else
			this._data.enableAnalytics = Boolean(enabled);
		return this;
	}

	/**
	 * Set crash assistance enabled
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setCrashAssistance(enabled) {
		if (enabled == undefined)
			this._data.crashAssistance = true;
		else
			this._data.crashAssistance = Boolean(enabled);
		return this;
	}

	/**
	 * Set if the launcher should be kept open upon launch
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setKeepLauncherOpen(enabled) {
		if (enabled == undefined)
			this._data.keepLauncherOpen = true;
		else
			this._data.keepLauncherOpen = Boolean(enabled);
		return this;
	}

	/**
	 * Set the locale name
	 * @param  {String} locale
	 * @return {This}
	 */
	setLocale(locale) {
		if (typeof locale == "string" && locale.length > 0)
			this._data.locale = locale;
		else
			this._data.locale = Locale.name().toLowerCase();
		return this;
	}
	
	/**
	 * Set if the game log should be displayed
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setShowGameLog(enabled) {
		if (enabled == undefined)
			this._data.showGameLog = false;
		else
			this._data.showGameLog = Boolean(enabled);
		return this;
	}

	/**
	 * Set if the menu should be shown
	 * @param  {Boolean} enabled
	 * @return {This}
	 */
	setShowMenu(enabled) {
		if (enabled == undefined)
			this._data.showMenu = true;
		else
			this._data.showMenu = Boolean(enabled);
		return this;
	}
}

// Export the module
module.exports = {LauncherSettings};