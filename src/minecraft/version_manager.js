const download = require('download-file');
const got = require('got');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
const TIMEOUT = 10000 // 10 seconds

var path;
var versionList;
var versionsInstalled;

exports.init = function() {

	// Save the path
	path = config.minecraftPath().path('versions');

	// Download versions
	exports.downloadVersionList();
	exports.loadInstalledVersions();

	// Return success
	return true;
};

exports.downloadVersionList = function() {
	got.get(URL, {
		json: true,
		timeout: TIMEOUT
	}).then(response => {
		versionList = response.body;
		console.log("The version is", versionList.latest);
	}); 
};

exports.versions = function(options) {
	
};

exports.versionsInstalled = function() {
	return versionsInsalled;
};

exports.loadVersion = function(version, callback) {

	// Check if the version is not installed
	if (versionsInstalled.indexOf(version) == -1) {
		for (var i = 0; i < versionList.versions.length; i++) {
			if (versionList.versions[i].id == version) {
				exports.installVersion(versionList.versions[i], callback);
				return;
			}
		}
		console.log("ERROR: Can't find version", version);
		return;
	}
	console.log("The version exists!");
};

exports.loadInstalledVersions = function() {
	versionsInstalled = [];
	var versionsDir = jetpack.cwd(path);
	var folders = versionsDir.list();
	var file;
	for (var i = 0; i < folders.length; i++) {
		file = versionsDir.cwd(folders[i]).path(folders[i] + '.json');
		if (file)
			versionsInstalled.push(file);
	}
};

exports.installVersion = function(version, callback) {

	console.log("Downloading version:", version.id, version.url);

	// Download location
	var dir = jetpack.cwd(path).cwd(version.id);
	jetpack.dir(dir.path());
	// Download the file
	got(version.url, {
		json: true
	}).then(response => {
		jsonfile.writeFile(dir.path(version.id + '.json'), response.body, (error) => {
			if (error)
				console.error("ERROR: Failed to download Minecraft version:", version.id);
			else {
				console.log(`Minecraft ${version.id} installed successfully!`);
				callback();
			}
		});
	}); 
};