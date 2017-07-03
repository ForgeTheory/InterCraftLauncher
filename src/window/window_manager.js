const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const ControlPanel = require('./control_panel').ControlPanel;
const Login        = require('./login').Login;
const Splash       = require('./splash').Splash;
const Window       = require('./window').Window;

const TEMPLATES_PATH = '../views';

var windows = {};

// Create a window
var createWindow = function(name, properties) {

	console.log("Creating window " + name);

	if (windows[name] != undefined)
		console.warn("WARNING: Window " + name + " already exists!");

	// Property stuff...
	properties['toolBar'] = false;
	if (properties.show == undefined)
		properties.show = false;

	// Create the window and remove the menu bar
	var win = new BrowserWindow(properties);
	win.name = name;
	win.isReadyToShow = false;
	win.showWhenReadyEnabled = false;
	win.setMenu(null);

	win.on('closed', () => {
		windows[name] = undefined;
	});

	win.on('show', () => {
		console.log("Checking for the splash...");
		if ((windows.splash != undefined || windows.splash != null) && windows.splash != win) {
			console.log("Closing the splash...");
			windows.splash.close();
			windows.splash = undefined;
		}
	});

	// Give the setView method
	win.setView = (view) => {
		win.isReadyToShow = false;
		win.loadURL(url.format({
			pathname: path.join(__dirname, `${TEMPLATES_PATH}/${view}.htm`),
			protocol: 'file:',
			slashes: true
		}));
	};

	win.on('ready-to-show', () => {
		win.isReadyToShow = true;
		if (win.showWhenReadyEnabled)
			win.show();
		win.showWhenReadyEnabled = false;
	});

	win.showWhenReady = () => {
		if (win.isReadyToShow)
			win.show();
		else
			win.showWhenReadyEnabled = true;
	};

	// Add the window to the list and return
	windows[name] = win;
	return win;
}

exports.init = function() {
};

exports.createSplash = function(callback) {
	windows.splash = new Splash();
	windows.splash.on('ready-to-show', () => {
		windows.splash.show();
		setTimeout(callback, 500);
	});
	windows.splash.on('close', () => { windows.splash = null; });
};

exports.splashWindow = function() {
	return windows.splash;
};

exports.closeSplash = function() {
	if (windows.splash)
		windows.splash.close();
};

exports.createControlPanel = function() {
	windows.control = new ControlPanel();
	windows.control.on('closed', () => { windows.control = null; })
	               .on('show',   () => { exports.closeSplash(); });
	// windows.control.window().openDevTools();
};

exports.controlPanel = function() {
	if (windows.control == null)
		exports.createControlPanel();
	return windows.control;
};

exports.createLoginWindow = function() {
	windows.login = new Login();
	windows.login.on('closed', () => { windows.login = null; })
	             .on('show',   () => { exports.closeSplash(); });
};

exports.loginWindow = function() {
	if (windows.login == undefined)
		exports.createLoginWindow();
	return windows.login;
};

exports.quit = function() {
	console.log("Closing windows...");
	var keys = Object.keys(windows);
	for (var i = 0; i < keys.length; i++) {
		windows[keys[i]] = null;
	}
};