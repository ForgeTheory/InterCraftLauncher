const { ipcSend, ipcReceive } = require('electron-simple-ipc');

const cache = require('./cache');
const config = require('./config');
const errors = require('./errors');
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
		config.init,
		cache.init,
		minecraft.init
	];

	var initModule = (modules) => {
		if (modules.length == 0)
			return initFinished(errors.NO_ERROR);

		modules[0]((error) => {
			if (error != errors.NO_ERROR)
				return initFinished(error);
			initModule(modules.slice(1));
		});
	};
	initModule(moduleList);
};

/**
 * Execute when the launcher finished initializing, regardless of errors
 * @param  {Integer} error
 * @return {Undefined}
 */
var initFinished = function(error) {
	if (error == errors.NO_ERROR) {
		console.log("Initialization finished");
		authenticate();
	} else {
		console.error("ERROR: Failed initializing");
		handleError(error);
	}
};

/**
 * Authenticate the session
 * @return {Undefined}
 */
var authenticate = function() {
	console.log("Authenticating session...");
	intercraftAuth.isOnline((isOnline) => {
		if (isOnline)
			intercraftAuth.authenticate((result) => {
				console.log(result);
				if (result)
					exports.controlPanel();
				else
					exports.login();
			});
		else
			console.log("Unable to connect to authentication servers");
	});
};

/**
 * Handle any errors thrown during the initialization and authentication phase.
 * @param  {Integer} error
 * @return {Undefined}
 */
var handleError = function(error) {
	console.log(error);
	console.log(errors.messages[error]);
};

var parseInterCraftSession = function() {
	intercraftAuth.isOnline((isOnline) => {
		if (isOnline)
			if (config.accessToken() == null ||
				config.accessToken == undefined ||
				config.accessToken().length != 40)
				
				exports.login();
			else
				intercraftAuth.fetchProfile((result) => {
					if (result) {
						exports.controlPanel();
					}
					else {
						exports.login();
					}
				});
		else {
			exports.offlinePanel();
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