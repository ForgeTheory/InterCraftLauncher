const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('../config');
const launcher = require('./launcher');
const profileManager = require('./profile_manager');
const versionManager = require('./version_manager');

let minecraftDir;
let RESOURCE_URL = "http://resources.download.minecraft.net";

exports.minecraftPath = function() {
	return minecraftDir;
};

exports.init = function() {
	var result = true;
	minecraftDir = config.minecraftPath();
	result = result && directoryExists();
	result = result && filesExist();
	result = result && profileManager.init();
	result = result && versionManager.init();
	result = result && launcher.init();

	return result;
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

exports.loadAssetIndex = function(version) {

};

var directoryExists = function() {
	return jetpack.exists(minecraftDir.path()) == 'dir';
};

var filesExist = function() {
	var result = true;
	result = result && jetpack.exists(minecraftDir.path('launcher_profiles.json'));
	return result;
};