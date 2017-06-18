const got = require('got');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
const TIMEOUT = 10000 // 10 seconds

var path;
var versions;
var versionsInstalled;

exports.init = function() {

	console.log("Initializing version manager...");

	// Save the path
	path = config.minecraftPath().path('launcher_profiles.json');

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
		versions = JSON.parse(response.body);
		console.log("The version is", versions.latest);
	}); 
}

exports.versions = function(options) {

}