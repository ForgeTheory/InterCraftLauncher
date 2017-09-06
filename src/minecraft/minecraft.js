const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('../config');
const authentication = require('./authentication');
const launcher = require('./launcher');
const profileManager = require('./profile_manager');
const versionManager = require('./version_manager');

let minecraftDir;
let RESOURCE_URL = "http://resources.download.minecraft.net";

exports.minecraftPath = function() {
	return minecraftDir;
};

exports.init = function(callback) {
	var result = true;
	minecraftDir = config.minecraftPath();

	if (!directoryExists())
		return callback("The given Minecraft directory could not be found");

	if (!profileManager.init())
		return callback("Failed to initialize the profile manager");

	if (!versionManager.init())
		return callback("Failed to initialize the version manager");

	callback();
};

exports.authentication = function() {
	return authentication;
};

exports.launcher = function() {
	return launcher;
};

exports.profileManager = function() {
	return profileManager;
}

exports.versionManager = function() {
	return versionManager;
};

var directoryExists = function() {
	return jetpack.exists(minecraftDir.path()) == 'dir';
};
