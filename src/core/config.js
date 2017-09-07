const jetpack  = require("fs-jetpack");
const jsonfile = require("jsonfile");

class Config
{
	static init(callback) {
		this._config = {};
		callback();
	}
}

// Export the module
module.exports = {Config}