(function () {'use strict';

const {BrowserWindow} = require('electron');
const { ipcSend, ipcReceive } = require('electron-simple-ipc');
const path = require('path');
const url = require('url');

const config = require('./config');
const intercraftAuth = require('./intercraft_auth');

let win;
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

let initEvents = function() {

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
};

exports.init = function() {

	// Initialize the configuration
	config.init();

	// Initilialize the window
	exports.initWindow();

	// Setup the events
	initEvents();

	// Set the initializing screen
	// win.setView('control');
	exports.controlPanel();
};

exports.initWindow = function() {
	win = new BrowserWindow({width: 1280, height: 720, frame: false});
	win.on('closed', () => {
		win = null;
	});
	win.openDevTools();
	win.setMenu(null);

	win.setView = (view) => {
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'views/' + view + '.htm'),
			protocol: 'file:',
			slashes: true
		}));
	};
};

exports.getInterCraftSession = function() {
	intercraftAuth.isOnline((isOnline) => {
		if (isOnline)
			if (config.accessToken() == null)
				exports.login();
			else
				intercraftAuth.fetchProfile((result) => {
					if (result) {
						profile = result;
						exports.controlPanel();
						console.log("Got the profile!", profile);
					}
					else {
						exports.login();
						console.log("Failed to get the profile");
					}
				});
		else {
			console.log("You are offline, so you don't have to log in");
			exports.offlinePanel();
		}
	});
};

exports.login = function() {
	console.log("Loading login form");
	win.setView('login');
};

exports.controlPanel = function() {
	console.log("Loading control panel");
	win.setView('index');
};

exports.offlinePanel = function() {
	console.log("Loading offline control panel");
	win.setView('offline');
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
	win = null;
	exports.emitEvent('quit');
};

exports.onQuit = function(callback) {
	eventListeners.quit.push(callback);
};

}());
//# sourceMappingURL=intercraft.js.map