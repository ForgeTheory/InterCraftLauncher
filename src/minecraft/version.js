const jetpack = require('fs-jetpack');

const config = require('../config');
const versionManager = require('./version_manager');

const Library = require('./library').Library;

class Version {
	constructor(versionJson) {

		this.id = versionJson.id;
		this.jar = versionJson.jar;
		this.parent = null;
		this.parentVersion = versionJson.inheritsFrom;
		this.downloads = versionJson.downloads;
		this.assetIndex = versionJson.assetIndex;
		this.assets = versionJson.assets;
		this.parseLibraries(versionJson.libraries);
	}

	/**
	 * Convert the libraries from JSON to Library objects
	 * @param  {Json Object} libraries
	 * @return {Undefined}
	 */
	parseLibraries(libraries) {
		this.libraries = [];
		for (var i = 0; i < libraries.length; i++) {
			var library = new Library(libraries[i]);
			if (library.isRequired())
				this.libraries.push(library);
		}
	}

	/**
	 * Resolve the version's inheritance
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	resolveInheritance(callback) {
		// Be able to access this in a closure
		var thisVersion = this;

		if (this.parentVersion != undefined) {
			versionManager.loadVersion(this.parentVersion, (version) => {
				if (version) {
					thisVersion.parent = version;
					return version.resolveInheritance(callback);
				}
				return callback(false);
			});
			return;
		}
		callback(true);
	}

	/**
	 * Resolve the version's libraries recursively
	 * @param  {Function} callback
	 * @param  {Array}   libraries  (leave blank please)
	 * @return {Undefined}
	 */
	resolveLibraries(callback, libraries) {
		if (libraries == undefined)
			libraries = [];

		libraries = libraries.concat(this.libraries);

		if (this.parent)
			return this.parent.resolveLibraries(callback, libraries);

		callback(libraries);
	}

	/**
	 * Search recursively for a jar URL
	 * @return {String|Undefined}
	 */
	jarUrl() {
		if (this.downloads != undefined && this.downloads.client != undefined)
			return this.downloads.client.url;

		else if (this.parent)
			return this.parent.jarUrl();

		return undefined;
	}

	/**
	 * Search recursively for a jar path
	 * @return {String|Undefined}
	 */
	jarPath() {
		if (this.jar != undefined) 
			return jetpack.cwd(versionManager.versionDirectory(this.jar)).path(this.jar + '.jar');
		
		if (jetpack.exists(jetpack.cwd(versionManager.versionDirectory(this.id)).path(this.id + '.jar'))
		    || (this.downloads != undefined && this.downloads.client != undefined))
			return jetpack.cwd(versionManager.versionDirectory(this.id)).path(this.id + '.jar');

		if (this.parent)
			return this.parent.jarPath();

		console.log("ERROR: Failed to find a jar path");
		return undefined;
	}
}

exports.Version = Version;