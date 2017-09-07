const locale   = require("locale");
const osLocale = require("os-locale");

let instance = null;

class Locale
{
	static init(updateStatus, callback) {

	}
	/**
	 * Create a new Locale instance
	 */
	constructor() {
		if (instance) return instance;
		return instance = this;
	}


}

module.exports = {Locale};
