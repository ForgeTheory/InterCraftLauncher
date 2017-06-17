(function () {'use strict';

const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const accountManager = require('./launcher_account');
const accountManager = require('./launcher_profile');

var version;
var profile;

exports.init = function() {
	exports.load(config.minecraftPath().path('launcher_profiles.json'));
};

exports.load = function(path) {

	// Clear the last profile
	version = undefined;
	profile = undefined;

	// Load the new version
	profile = jsonfile.readFileSync(path, {throws: false});

	// Display error if failed to load
	if (profile == null) {
		console.error("ERROR: Failed to load launcher profiles!", path);
		profile = undefined;
		return;
	}

	// Store the version for convenience.
	version = profile.launcherVersion;
};

}());
//# sourceMappingURL=launcher_profile_manager.js.map