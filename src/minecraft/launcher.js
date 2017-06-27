const profileManager = require('./profile_manager');
const versionManager = require('./version_manager');

const LaunchTask = require('./launch_task').LaunchTask;

var launchTasks = [];
var instances = [];

exports.init = function() {
	return true;
};

exports.launch = function(profileKey, callback) {
	console.log("Launching", profileKey);

	// Get the profile from the profile manager
	var profile = profileManager.profile(profileKey);

	// Update to the last used profile
	profileManager.use(profile);

	// Load the version
	versionManager.loadVersion(profile.version(), createLaunchTask);

};

var createLaunchTask = function(version) {
	var launchTask = new LaunchTask(version);
	launchTask.start(launchTaskFinished);
};

var launchTaskFinished = function(launchTask, result) {
	console.log('Launch task finished with result of', result);
};