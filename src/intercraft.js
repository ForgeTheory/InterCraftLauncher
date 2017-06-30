const { ipcSend, ipcReceive } = require('electron-simple-ipc');

const cache = require('./cache');
const config = require('./config');
const intercraftAuth = require('./intercraft_auth');
const minecraft = require('./minecraft/minecraft');
const windowManager = require('./window_manager');

let profile;
profile = { // Temporary profile for SirDavidLudwig
	'privilege': 2,
	'active': 1,
	'uuid': 'b50cffd9ee8949b9b1223f1da79b2080',
	'access_token': 'c1ab4bbaab938e687830fd1f3a7201d9deff2ad7'
};

let eventListeners = {
	"quit": []
};

// Login Event
ipcReceive('login', (payload) => {
	intercraftAuth.login(payload.email, payload.password, (result) => {
		if (result.isValid) {
			console.log("Valid");
			exports.controlPanel();
		} else {
			console.log("Failed to authenticate");
		}
	});
});

ipcReceive('initialized', (payload) => {
	console.log("Initialized");
	exports.getInterCraftSession();
});

ipcReceive('control_panel_done', (payload) => {
	console.log("Control panel finished loading, ready to show...");
	windowManager.controlPanel().showWhenReady();
});

ipcReceive('control_panel_launch_minecraft', (payload) => {
	var account = minecraft.profileManager().activeAccount();
	var profile = minecraft.profileManager().profile(payload.profile);
	minecraft.launcher().launch(profile, account, (result) => {
		console.log("Launch finished");
	});
});

exports.init = function() {

	// Initialize the configuration
	config.init();

	// Initialize the cache
	cache.init();

	// Initialize the window manager
	windowManager.init();

	// Display the splash during background processes
	windowManager.splash(initMinecraft);
};

var initMinecraft = function() {
	var nextStep = parseInterCraftSession;
	if (!minecraft.init())
		exports.configureMinecraft(nextStep);
	else
		nextStep();
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
						profile = result;
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

exports.configureMinecraft = function(callback) {
	console.log("Configuring Minecraft...");
};

exports.login = function() {
	console.log("Loading login form");
	windowManager.loginWindow().showWhenReady();
};

exports.controlPanel = function() {
	console.log("Loading control panel");
	windowManager.initControlPanel();
	windowManager.controlPanel().once('ready-to-show', () => {
		ipcSend('control_panel_preload_launcher_profiles', minecraft.profileManager().profilesAvailable());
		ipcSend('control_panel_preload_done', true);
		if (windowManager.loginWindow()) {
			windowManager.closeWindow('login');
		}
		minecraft.profileManager().save();
	});
	// windowManager.controlPanel().show();
};

exports.offlinePanel = function() {
	console.log("Loading offline control panel");
	windowManager.offlinePanel().show();
}

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