(function () {'use strict';

const download = require('download-file');
const got = require('got');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
const TIMEOUT = 10000; // 10 seconds

const Version = require('./version').Version;

var path;
var versionList;
exports.init = function() {

	// Save the path
	path = config.minecraftPath().path('versions');

	// Download versions
	exports.downloadVersionList();

	// Return success
	return true;
};

exports.downloadVersionList = function() {
	got.get(URL, {
		'timeout': TIMEOUT
	})
	.then(response => {
		versionList = JSON.parse(response.body);
		console.log("The version is", versionList.latest);
	}); 
};

exports.versions = function(options) {
	
};

exports.versionsInstalled = function() {
	installedVersions = [];
	var versionsDir = minecraftDir.cwd('versions');
	var folders = versionsDir.list();
	var file;
	for (var i = 0; i < folders.length; i++) {
		file = versionsDir.cwd(folders[i]).path(folders[i] + '.json');
		if (file)
			installedVersions.push(file);
	}
	return installedVersions;
};

exports.loadVersion = function(version, callback) {

	// Check if the version is not installed
	if (exports.versionsInstalled.indexOf(version) == -1) {
		for (var i = 0; i < versionList.versions.length; i++) {
			if (versionList.versions[i].id == version) {
				exports.downloadVersion(versionList.versions[i]);
				return;
			}
		}
		console.log("ERROR: Can't find version", version);
		return;
	}

	
};

exports.downloadVersion = function(version, callback) {

	console.log("Downloading version:", version.id);

	// Download location
	var dir = jetpack.cwd(path).path(version.id);

	// Download the file
	download(
		version.url,
		{'directory':  dir},
		(error) => {
			if (error)
				console.error("Error: Failed to download Minecraft version", version.id);
			else
				console.log("Version downloaded", version.id);
		}
	);
};

}());
//# sourceMappingURL=version_manager.js.map