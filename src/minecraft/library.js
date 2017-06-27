const jetpack = require('fs-jetpack');

const config = require('../config');
const utils = require('../utils');

class Library {
	constructor(libraryJson) {
		this.parseName(libraryJson.name);
		this.parseNatives(libraryJson.natives);
		this.parseRules(libraryJson.rules);
		this.parseUrl(libraryJson.downloads);
	}

	parseName(name) {
		this.libName = name;
		var parts = this.libName.split(':');
		if (parts.length != 3) {
			console.log("ERROR: Invalid library name");
			return;
		}
	}

	parseNatives(natives) {
		if (natives == undefined) {
			this.libNatives = undefined;
			return;
		}
		if (natives[utils.os()] != undefined)
			this.libNatives = natives[utils.os()];
	}

	parseRules(rules) {
		this.isUsed = true;

		if (rules == undefined)
			return;

		for (var i = 0; i < rules.length; i++) {
			if (rules[i].action == 'allow') {
				if (rules[i].os == undefined)
					this.isUsed = true;
				else
					this.isUsed = rules[i].os.name == utils.os();
			}
			else if (rules[i].action == 'disallow') {
				if (rules[i].os == undefined)
					this.isUsed = false;
				else
					this.isUsed = rules[i].os.name != utils.os();
			}
		}
	}

	parseUrl(downloads) {
		if (downloads == undefined) {
			this.libUrl = undefined;
			return;
		}

		if (this.libNatives == undefined) {
			if (downloads.artifact != undefined)
				if (downloads.artifact.url != undefined)
					this.libUrl = downloads.artifact.url;
		} else {
			if (downloads.classifiers != undefined)
				if (downloads.classifiers[this.libNatives] != undefined)
					if (downloads.classifiers[this.libNatives].url != undefined)
						this.libUrl = downloads.classifiers[this.libNatives].url;
		}
	}

	isRequired() {
		return this.isUsed;
	}

	isInstalled() {
		return jetpack.exists(this.path());
	}

	downloadUrl() {
		return this.libUrl;
	}

	name() {
		return this.libName;
	}

	path() {
		var parts = this.libName.split(':');
		if (parts.length != 3) {
			console.log("ERROR: Invalid library name");
			return;
		}
		var pathParts = parts[0].split('.');
		var path = config.minecraftPath().cwd('libraries');

		for (var i = 0; i < pathParts.length; i++)
			path = path.cwd(pathParts[i]);

		path = path.cwd(parts[1]).cwd(parts[2]).path(parts[1] + '-' + parts[2]);

		if (this.libNatives)
			path += '-' + this.libNatives;

		return path + '.jar';
	}
}

exports.Library = Library;