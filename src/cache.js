const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('./config');
const utils = require('./utils/utils');

const FILE_NAME = 'cache.json';
var entries = [];

exports.init = function() {
	jsonfile.readFile(FILE_NAME, (err, obj) => {
		if (err)
			return;
		entries = obj;
		console.log(entries);
		exports.clean();
	});
};

// This needs to be better, no feedback on whether an element was actually cleaned
exports.clean = function(path) {
	console.log("Cleaning cache...");
	if (path == undefined) {
		for (var i = 0; i < entries.length; i++){
			if (jetpack.exists(entries[i]))
				jetpack.remove(entries[i]);
			else {
				entries = utils.arrayRemove(entries, i--); // Remove element, and decrement i
			}
		}
	} else if (entries.indexOf(path) != -1) {

	}
};

exports.addEntry = function(entry) {
	entries.push(entry);
	jsonfile.writeFile(FILE_NAME, entries, (err) => {
		if (err)
			console.error("ERROR: Failed to save cache");
	});
};

/**
 * Create and add a temporary path to the cache
 * @return {String}
 */
exports.createTempPath = function() {
	console.log("Creating temporary path");
	var folder = utils.randomHexStringPartitioned([4, 4, 4, 4]);
	var path = config.tempPath().path(folder);
	exports.addEntry(path);
	jetpack.dir(path);
	return path;
};