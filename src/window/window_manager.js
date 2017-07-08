const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const ControlPanel = require('./control_panel').ControlPanel;
const Login        = require('./login').Login;
const Splash       = require('./splash').Splash;
const Window       = require('./window').Window;

const TEMPLATES_PATH = '../views';

var windows = {};

exports.createSplash = function() {
	windows.splash = new Splash();
	windows.splash.on('ready-to-show', () => {
		windows.splash.show();
		exports.closeOtherWindows(windows.splash);
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
	windows.control.window().openDevTools();
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

exports.closeOtherWindows = function(win) {
	var keys = Object.keys(windows);
	for (var i = 0; i < keys.length; i++) {
		if (windows[keys[i]] != win) {
			if (windows[keys[i]])
				windows[keys[i]].close();
			windows[keys[i]] = null;
		}
	}
};

exports.quit = function() {
	console.log("Closing windows...");
	var keys = Object.keys(windows);
	for (var i = 0; i < keys.length; i++) {
		if (windows[keys[i]])
			windows[keys[i]].nullify();
		windows[keys[i]] = null;
	}
};