const jsonfile = require('jsonfile')
const locale   = require('locale');
const osLocale = require('os-locale');

const config = require('./config');

var supportedLocales = new locale.Locales(["en_US"]);
var acceptedLocale   = null;
var localeLang       = null;
var localeDict       = null;

exports.init = function(callback) {
	if (config.locale()) {
		return exports.setLocale(new locale.Locales(config.locale()), callback);
	}
	osLocale().then(localeNormalized => {
		exports.setLocale(new locale.Locales(localeNormalized), callback);
	});
};

exports.setLocale = function(locales, callback) {
	localeLang = locales.best(supportedLocales) || locale.Locale["default"];
	jsonfile.readFile(`./locale/${localeLang.normalized}.json`, {throws: false}, (error, obj) => {
		if (error)
			return callback("Failed to set locale: " + error);
		localeDict = obj;
		config.setLocale(locales)
		callback();
	});
};

exports.language = function() {
	return localeLang.normalized;
};

exports.locale = function() {
	return localeDict;
};