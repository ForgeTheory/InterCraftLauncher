const profileManager = require('./profile_manager');

exports.init = function() {
	return true;
};

exports.launch = function(profileKey, callback) {
	console.log("Launching", profileKey);

	// Get the profile from the profile manager
	var profile = profileManager.profile(profileKey);

	// Update to the last used profile
	profileManager.use(profile);
};