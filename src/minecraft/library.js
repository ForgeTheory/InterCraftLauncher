const fs = require('fs');
const jetpack = require('fs-jetpack');
const unzip = require('unzip');

const config = require('../config');
const utils = require('../utils');

class Library {
	constructor(libraryJson) {
		this.libName = null;
		this.libNatives = null;
		this.libUrl = null;
		this.libExtract = null;
		this.isUsed = true;

		this.parseName(libraryJson.name);
		this.parseNatives(libraryJson.natives);
		this.parseRules(libraryJson.rules);
		this.parseUrl(libraryJson.downloads);
		this.parseExtract(libraryJson.extract);
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
			this.libUrl = null;
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

	parseExtract(extract) {
		if (extract == undefined)
			return;

		this.libExtract = extract;
	}

	isRequired() {
		return this.isUsed;
	}

	isInstalled() {
		return jetpack.exists(this.path());
	}

	needsExtraction() {
		return this.libExtract != null;
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

	extract(path, callback) {
		if (!this.libExtract == null)
			return callback();

		console.log(`Extracting ${this.name()}`);

		var exclude = this.libExtract.exclude;
		if (exclude == undefined)
			exclude = [];

		fs.createReadStream(this.path())
			.pipe(unzip.Parse())
			.on('entry', (entry) => {
				var fileName = entry.path;
				var type = entry.type; // 'Directory' or 'File'
				var size = entry.size;

				if (exclude.indexOf(fileName) > -1)
					return entry.autodrain();
				
				console.log(fileName, type);
				if (type == 'Directory' || fileName[fileName.length-1] == '/') { // Check file name for '/' on OSX
					console.log("It's a folder ", fileName);
					jetpack.dir(jetpack.cwd(path).path(fileName));
					return entry.autodrain();
				}

				if (jetpack.exists(jetpack.cwd(path).cwd(fileName).path('../')))
					entry.pipe(fs.createWriteStream(jetpack.cwd(path).path(fileName)));
				else
					entry.autodrain();
			})
			.on('close', () => { callback(); });
	}
}

exports.Library = Library;