const { ipcSend, ipcReceive } = require('electron-simple-ipc');

const config = require('./config');
const intercraftAuth = require('./intercraft_auth');
const minecraft = require('./minecraft/minecraft');
const windowManager = require('./window/window_manager');

let eventListeners = {
	"quit": []
};

/**
 * Start the InterCraft launcher
 * @return {Undefined}
 */
exports.start = function() {

	// Display the splash during background processes
	windowManager.createSplash();

	// Start initialization process after splash is visible
	windowManager.splashWindow().window().once('show', init);
};

/**
 * Initialize the launcher's core modules
 * @return {Undefined}
 */
var init = function() {
	console.log("Initializing modules...");

	// List of modules to initialize
	var moduleList = [
		config.init, "Config init",
		minecraft.init, "Minecraft init",
		minecraft.launcher().init, "Launcher init"
	];

	var initModule = (modules) => {
		if (modules.length == 0)
			return initFinished(false);

		modules[0]((error) => {
			if (error)
				return initFinished(error, modules[1]);
			initModule(modules.slice(2));
		});
	};
	initModule(moduleList);
};

/**
 * Execute when the launcher finished initializing, regardless of errors
 * @param  {Boolean} error
 * @return {Undefined}
 */
var initFinished = function(error, module = undefined) {
	if (!error) {
		console.log("Initialization finished");
		return authenticate();
	}
	console.error(`ERROR: Failed initializing ${module}`);
};

/**
 * Authenticate the session
 * @return {Undefined}
 */
var authenticate = function() {
	console.log("Authenticating session...");
	intercraftAuth.isOnline((isOnline) => {
		if (isOnline) {
			intercraftAuth.authenticate((result) => {
				console.log(result);
				if (result)
					exports.controlPanel();
				else
					exports.login();
				windowManager.splashWindow().close();
			});
		} else {
			console.log("Unable to connect to authentication servers");
			exports.quit();
		}
	});
};

/**
 * Open the login window
 * @return {Undefined}
 */
exports.login = function() {
	console.log("Loading login form");
	windowManager.loginWindow().showWhenReady();
};

/**
 * Open the control panel if logged in, otherwise open the login window
 * @return {Undefined}
 */
exports.controlPanel = function() {
	
	if (!intercraftAuth.isLoggedIn())
		return exports.login();

	console.log("Displaying control panel");
	windowManager.controlPanel().showWhenReady();
};

exports.offlinePanel = function() {
	console.log("Loading offline control panel");
	windowManager.offlinePanel().show()
};

exports.activate = function() {
	exports.initWindow();
};

exports.emitEvent = function(name) {
	for (var i = 0; i < eventListeners[name].length; i++) {
		eventListeners[name][i]();
	}
};

exports.quit = function() {
	windowManager.quit();
	exports.emitEvent('quit');
};

exports.onQuit = function(callback) {
	eventListeners.quit.push(callback);
};
