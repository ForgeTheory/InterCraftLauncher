const profileManager = require('./profile_manager');
const versionManager = require('./version_manager');

const LaunchTask = require('./launch_task').LaunchTask;

var launchTasks = [];
var instances = [];

/**
 * Initialize the launcher
 * @return {Boolean}
 */
exports.init = function() {
	return true;
};

/**
 * Launch an instance of Minecraft
 * @param  {Profile}  profile 
 * @param  {Account}  account 
 * @param  {Function} callback
 * @return {Undefined}           
 */
exports.launch = function(profile, account, callback) {
	console.log("Launching", profile.displayName());

	// Get the required stuff
	var clientToken = profileManager.clientToken();

	// Update to the last used profile
	profileManager.use(profile);

	// Load the version, then create a launch task
	versionManager.loadVersionFromProfile(profile, (version) => {
		createLaunchTask(clientToken, account, profile, version, callback);
	});
};

/**
 * Create a launch task
 * @param  {String}   clientToken
 * @param  {Account}  account    
 * @param  {Profile}  profile    
 * @param  {Version}  version    
 * @param  {Function} callback   
 * @return {Undefined}              
 */
var createLaunchTask = function(clientToken, account, profile, version, callback) {
	var launchTask = new LaunchTask(clientToken, account, profile, version);
	launchTask.start((launchTask, result, minecraftInstance) => {
		launchTaskFinished(launchTask, result, minecraftInstance, callback);
	});
};

/**
 * Callback when a launch task finishes
 * @param  {LaunchTask}          launchTask       
 * @param  {Boolean}             result           
 * @param  {MinecraftInstance}   minecraftInstance
 * @param  {Function}            callback         
 * @return {Undefined}                    
 */
var launchTaskFinished = function(launchTask, result, minecraftInstance, callback) {
	if (result) { // Check if the launch task was successful
		console.log("Starting Minecraft...");
		minecraftInstance.start();
	}
	callback(result);
};