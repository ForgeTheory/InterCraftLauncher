const {LauncherProfile} = require("./launcher_profile");

class LauncherProfileManager
{
	constructor(profiles) {
		this._profiles = {};
	}

	json() {
		return {};
	}
}

// Export the module
module.exports = {LauncherProfileManager};