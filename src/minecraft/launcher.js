const jsonfile = require('jsonfile');

const utils          = require('../utils/utils');
const profileManager = require('./profile_manager');
const versionManager = require('./version_manager');

const {LaunchTask} = require('./launch_task');
const {MinecraftInstance} = require('./minecraft_instance');

const FILE_NAME = 'sessions.json';

var launchTasks = [];
var instances = [];

/**
 * Initialize the launcher, load the Minecraft instances saved on the disk
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.init = function(callback) {
	jsonfile.readFile(FILE_NAME, (error, obj) => {
		if (error)
			obj = [];
		for (var i = 0; i < obj.length; i++) {
			var path = obj[i].tempPath;
			var pid  = obj[i].pid;
			var instance = new MinecraftInstance(null, null, null, null, null, path, pid);
			if (instance.isRunning())
				instances.push(instance);
			else
				instance.clean();
		}
		exports.save((error) => {
			callback(error ? "Failed to save launcher cache" : undefined);
		});
	});
};

/**
 * Write the Minecraft sessions to disk
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.save = function(callback) {
	var result = [];
	for (var i = 0; i < instances.length;) {
		console.log("Found an instance");
		if (instances[i].isRunning()) {
			console.log("It's running too");
			result.push({
				'tempPath': instances[i].tempPath(),
				'pid': instances[i].pid()
			});
			i++;
		} else {
			instances[i].clean();
			instances = utils.arrayRemove(instances, i);
		}
	}
	jsonfile.writeFile(FILE_NAME, result, (error) => {
		if (callback)
			callback(Boolean(error));
	});
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
		minecraftInstance.onClose(instanceFinished);
		minecraftInstance.start((result) => {
			if (result) {
				instances.push(minecraftInstance);
				exports.save();
			}
			else
				minecraftInstance.clean();
		});
	} else {
		minecraftInstance.clean();
	}
	callback(result);
};

/**
 * Invoked when a Minecraft instance is finished
 * @param  {MinecraftInstance} minecraftInstance
 * @return {Undefined}
 */
var instanceFinished = function(minecraftInstance) {
	exports.save();
};

/**
 * Get the list of current instances
 * @return {Array<MinecraftInstance>}
 */
exports.instances = function() {
	return instances;
};