const fs = require('fs');
const jetpack = require('fs-jetpack');
const unzip = require('unzip');

const config = require('../config');
const utils = require('../utils');

class Library {
	constructor(libraryJson) {
		this._name = null;
		this._natives = null;
		this._url = null;
		this._extract = null;
		this._isUsed = true;

		this.parseName(libraryJson.name);
		this.parseNatives(libraryJson.natives);
		this.parseRules(libraryJson.rules);
		this.parseUrl(libraryJson.downloads);
		this.parseExtract(libraryJson.extract);
	}

	parseName(name) {
		this._name = name;
		var parts = this._name.split(':');
		if (parts.length != 3) {
			console.log("ERROR: Invalid library name");
			return;
		}
	}

	parseNatives(natives) {
		if (natives == undefined) {
			this._natives = undefined;
			return;
		}
		if (natives[utils.os()] != undefined)
			this._natives = natives[utils.os()];
	}

	parseRules(rules) {
		if (rules == undefined)
			return;

		for (var i = 0; i < rules.length; i++) {
			if (rules[i].action == 'allow') {
				if (rules[i].os == undefined)
					this._isUsed = true;
				else
					this._isUsed = rules[i].os.name == utils.os();
			}
			else if (rules[i].action == 'disallow') {
				if (rules[i].os == undefined)
					this._isUsed = false;
				else
					this._isUsed = rules[i].os.name != utils.os();
			}
		}
	}

	parseUrl(downloads) {
		if (downloads == undefined) {
			this._url = null;
			return;
		}

		if (this._natives == undefined) {
			if (downloads.artifact != undefined)
				if (downloads.artifact.url != undefined)
					this._url = downloads.artifact.url;
		} else {
			if (downloads.classifiers != undefined)
				if (downloads.classifiers[this._natives] != undefined)
					if (downloads.classifiers[this._natives].url != undefined)
						this._url = downloads.classifiers[this._natives].url;
		}
	}

	parseExtract(extract) {
		if (extract == undefined)
			return;

		this._extract = extract;
	}

	isRequired() {
		return this._isUsed;
	}

	isInstalled() {
		return jetpack.exists(this.path());
	}

	needsExtraction() {
		return this._extract != null;
	}

	downloadUrl() {
		return this._url;
	}

	name() {
		return this._name;
	}

	path() {
		var parts = this._name.split(':');
		if (parts.length != 3) {
			console.log("ERROR: Invalid library name");
			return;
		}
		var pathParts = parts[0].split('.');
		var path = config.minecraftPath().cwd('libraries');

		for (var i = 0; i < pathParts.length; i++)
			path = path.cwd(pathParts[i]);

		path = path.cwd(parts[1]).cwd(parts[2]).path(parts[1] + '-' + parts[2]);

		if (this._natives)
			path += '-' + this._natives;

		return path + '.jar';
	}

	extract(path, callback) {
		if (!this._extract == null)
			return callback();

		console.log(`Extracting ${this.name()}`);

		var exclude = this._extract.exclude;
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