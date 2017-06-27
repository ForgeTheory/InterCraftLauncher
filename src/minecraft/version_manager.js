const got = require('got');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
const TIMEOUT = 10000 // 10 seconds

const Version = require('./version').Version;

var path;
var versionList;
var versionsInstalled;

/**
 * Initialize the version manager
 * @return {Boolean}
 */
exports.init = function() {

	// Save the path
	path = config.minecraftPath().path('versions');

	// Download versions
	exports.downloadVersionList();
	exports.loadInstalledVersions();

	// Return success
	return true;
};

/**
 * Download the list of versions
 * @return {uUndefined}
 */
exports.downloadVersionList = function(callback) {
	versionList = undefined;
	got.get(URL, {
		json: true,
		timeout: TIMEOUT
	}).then(response => {
		versionList = response.body;
		if (callback)
			callback(versionList);
	}); 
};

/**
 * Load the installed versions
 * @return {Undefined}
 */
exports.loadInstalledVersions = function() {
	versionsInstalled = [];
	var versionsDir = jetpack.cwd(path);
	var folders = versionsDir.list();
	var file;
	for (var i = 0; i < folders.length; i++) {
		file = versionsDir.cwd(folders[i]).path(folders[i] + '.json');
		if (file)
			versionsInstalled.push(folders[i]);
	}
};

/**
 * Get the list of versions
 * @param  {Json Object} options
 * @return {Array}
 */
exports.versions = function(options) {
	return versionList;
};

/**
 * Get the list of installed versions
 * @return {Array}
 */
exports.versionsInstalled = function() {
	return versionsInstalled;
};

/**
 * Check if a given version is installed
 * @param  {String}  version
 * @return {Boolean}
 */
exports.isVersionInstalled = function(version) {
	return versionsInstalled.indexOf(version) > -1 && 
	       jetpack.exists(exports.versionPath(version));
};

/**
 * Get the path of a version
 * @param  {String} version
 * @return {String}
 */
exports.versionPath = function(version) {
	return jetpack.cwd(path).cwd(version).path(version + '.json');
};

/**
 * Get the directory path of a version
 * @param  {String} version
 * @return {String}
 */
exports.versionDirectory = function(version) {
	return jetpack.cwd(path).path(version); 
}

/**
 * Load a Minecraft version, install it if it doesn't exist
 * @param  {String}   version
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.loadVersion = function(version, callback) {

	// Check if the version is not installed
	if (!exports.isVersionInstalled(version)) {
		for (var i = 0; i < versionList.versions.length; i++) {
			if (versionList.versions[i].id == version) {
				exports.installVersion(versionList.versions[i], callback);
				return;
			}
		}
		callback(null);
		return;
	}
	jsonfile.readFile(exports.versionPath(version), (err, result) => {
		if (err)
			console.log("ERROR: Failed to load version", version);
		else {
			var v = new Version(result);
			callback(v);
		}
	});
};

/**
 * Install a given version of Minecraft
 * @param  {Version object}   version
 * @param  {Function} callback
 * @return {Undefined}
 */
exports.installVersion = function(version, callback) {

	console.log("Installing version:", version.id, version.url);

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
				callback(new Version(response.body));
			}
		});
	}); 
};
