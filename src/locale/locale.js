const jsonfile = require("jsonfile");
const locale   = require("locale");
const osLocale = require("os-locale");
const {Config} = require("../core/config");

let instance = null;

const LOCALE_PATH = "data/locales";
const SUPPORTED_LOCALES = new locale.Locales([
	"en_US"
]);

class Locale
{
	/**
	 * Get the 
	 * @param  {String|Undefined} key
	 * @return {String|Undefined}
	 */
	static get(key) {
		var dict = JSON.parse(JSON.stringify(instance.dictionary()));
		if (key == undefined)
			return dict;
		try {
			var keys = key.split(".");
			for (var k in keys)
				dict = dict[keys[k]];
			return dict;
		} catch(err) {
			console.error(err);
		}
		return undefined;
	}

	/**
	 * Initialize the locale 
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static init(callback) {
		console.log("Locale initializing...");
		instance = new Locale();
		if (Config.locale()) {
			instance.setLocale(Config.locale(), callback);
		} else {
			osLocale().then(localeNormalized => {
				instance.setLocale(localeNormalized, callback);
			});
		}
	}
	/**
	 * Create a new Locale instance
	 */
	constructor() {
		if (instance) return instance;
		this._accepted  = null;
		this._lang      = null;
		this._dict      = null;
		return instance = this;
	}

	/**
	 * Get the locale Json
	 * @return {Json Object}
	 */
	dictionary() {
		return this._dict;
	}

	/**
	 * Set the locale
	 * @param {String|Null} localeName
	 * @param {Function}    callback
	 */
	setLocale(localeName, callback) {
		var l = new locale.Locales(localeName);
		this._lang = l.best(SUPPORTED_LOCALES) || locale.Locale("default");
		jsonfile.readFile(
			`./${LOCALE_PATH}/${this._lang.normalized}.json`,
			{throws: false},
			(err, obj) => {
				if (err)
					return callback("Failed to set locale: " + err)
				this._dict = obj;
				Config.setLocale(this._lang.normalized);
				callback();
			}
		);
	}
}

// Export the module
module.exports = {Locale};
