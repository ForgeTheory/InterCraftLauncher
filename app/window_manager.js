(function () {'use strict';

const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let windows;

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
			pathname: path.join(__dirname, 'views/' + view + '.htm'),
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
};

exports.init = function() {
	windows = {};
};

exports.splash = function(callback) {
	var splashWin = createWindow('splash', {
		width: 600,
		height: 400,
		frame: false
	});
	splashWin.on('ready-to-show', () => {
		splashWin.show();
		setTimeout(callback, 500);
	});
	splashWin.setView('splash');
};

exports.splashWindow = function() {
	return windows.splash;
};

exports.initControlPanel = function() {
	var controlWin = createWindow('control', {
		width: 1280,
		height: 720,
		frame: true,
		minWidth: 992,
		minHeight: 500,
	});
	controlWin.on('closed', () => {
		controlWin = null;
	});
	controlWin.openDevTools();
	controlWin.setView('index');
};

exports.controlPanel = function() {
	if (windows.control == undefined)
		exports.initControlPanel();
	return windows.control;
};

exports.quit = function() {
	console.log("Closing windows...");
	var keys = Object.keys(windows);
	for (var i = 0; i < keys.length; i++) {
		windows[keys[i]] = null;
	}
};

}());
//# sourceMappingURL=window_manager.js.map