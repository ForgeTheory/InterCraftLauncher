(function () {'use strict';

const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const minecraftAccount = require('./launcher_account');
const Profile = require('./launcher_profile');

var profiles;
var version;

exports.init = function() {
	exports.load(config.minecraftPath().path('launcher_profiles.json'));
};

exports.load = function(path) {

	// Clear the last profile
	version = undefined;
	profile = undefined;

	// Load the launcher profiles file
	var profile = jsonfile.readFileSync(path, {throws: false});

	// Display error if failed to load
	if (profile == null) {
		console.error("ERROR: Failed to load launcher profiles!", path);
		profile = {};
	}

	// Store the version for convenience.
	parseVersion(profile);

	// Load the launcher profiles
	parseProfiles(profile);

	// Parse the client token
	parseClientToken(profile);
};

var parseVersion = function(launcherProfile) {

	// Check if the launcher version is defined
	if (launcherProfile.launcherVersion == undefined) {
		// Generate a launcher version
		version = {
			name: "2.0.934",
			format: 20,
			profilesFormat: 2
		};
	} else {
		// Load the version from the launcher
		version = launcherProfile.launcherVersion;
	}
};

var parseProfiles = function(launcherProfile) {

	// Initialize the profile dictionary if none available
	if (launcherProfile.profiles == undefined) {
		profiles = [];
		return;
	}

	// Get the keys from the profile
	var profs = launcherProfile.profiles;
	var keys = Object.keys(profs);
	var i, j;

	for (i = 0; i < keys.length; i++) {
		profiles.push(new Profile(profs[keys[i]]));
	}
};

exports.profiles = function() {

};

// Generate the list of available profiles sorted by 'last used' date
exports.profilesAvailable = function() {
};

}());
//# sourceMappingURL=launcher_profile_manager.js.map