const fs = require('fs');
const jetpack = require('fs-jetpack');
const unzip = require('unzip');

const config = require('../config');
const utils = require('../utils/utils');

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

	/**
	 * Parse the name of the library
	 * @param  {String} name
	 * @return {Undefined}
	 */
	parseName(name) {
		this._name = name;
		var parts = this._name.split(':');
		if (parts.length != 3)
			console.log("ERROR: Invalid library name");
	}

	/**
	 * Parse the library's natives
	 * @param  {Json Object|Undefined} natives
	 * @return {Undefined}
	 */
	parseNatives(natives) {
		if (natives == undefined)
			this._natives = undefined;
	
		else if (natives[utils.os()] != undefined)
			this._natives = natives[utils.os()];
	}

	/**
	 * Parse the library's rules
	 * @param  {Json Object|Undefined} rules
	 * @return {Undefined}
	 */
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

	/**
	 * Parse the download URL
	 * @param  {Json Object|Undefined} downloads
	 * @return {Undefined}
	 */
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

	/**
	 * Parse the library extraction
	 * @param  {Json Object|Undefined} extract
	 * @return {Undefined}
	 */
	parseExtract(extract) {
		if (extract == undefined)
			return;
		this._extract = extract;
	}

	/**
	 * Determine if the library is required
	 * @return {Boolean}
	 */
	isRequired() {
		return this._isUsed;
	}

	/**
	 * Determine if the library is currently installed
	 * @return {Boolean}
	 */
	isInstalled() {
		return jetpack.exists(this.path());
	}

	/**
	 * Determine if the library needs extraction
	 * @return {Boolean}
	 */
	needsExtraction() {
		return this._extract != null;
	}

	/**
	 * Get the download URL
	 * @return {String|Undefined}
	 */
	downloadUrl() {
		return this._url;
	}

	/**
	 * Get the name of the library
	 * @return {String}
	 */
	name() {
		return this._name;
	}

	/**
	 * Get the installation path of the library
	 * @return {String}
	 */
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

	/**
	 * Extract the library to the given path
	 * @param {String}   path
	 * @param {Function} callback
	 * @return {Undefined}
	 */
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

module.exports = {Library};
