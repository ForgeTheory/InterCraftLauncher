const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('../config');
const errors = require('../errors');
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
		return callback(errors.INVALID_MINECRAFT_PATH);

	if (!profileManager.init())
		return callback(errors.INIT_PROFILE_MANAGER_FAILED);

	if (!versionManager.init())
		return callback(errors.INIT_VERSION_MANAGER_FAILED);

	callback(errors.NO_ERROR);
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
