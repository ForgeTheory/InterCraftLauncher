const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const downloadManager = require('../download_manager');
const versionManager = require('./version_manager');

const AssetIndex = require('./asset_index').AssetIndex;
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
	 * Load an asset index
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	loadAssetIndex(callback) {

		// Download the asset if it doesn't exist
		if (!jetpack.exists(this.assetIndexPath())) {
			downloadManager.download(this.assetIndexUrl(), this.assetIndexPath(), () => {
				jsonfile.readFile(this.assetIndexPath(), (err, obj) => {
					if (err) {
						console.log("ERROR: Failed to load asset index");
						return callback(null);
					}
					callback(new AssetIndex(obj));
				});
			});
		}

		// Open the asset file
		jsonfile.readFile(this.assetIndexPath(), (err, obj) => {
			if (err) {
				console.log("ERROR: Failed to load asset index");
				return callback(null);
			}
			callback(new AssetIndex(obj));
		});
	}

	/**
	 * Get the url of the asset index
	 * @return {String}
	 */
	assetIndexUrl() {
		if (this.assetIndex != undefined)
			return this.assetIndex.url;
		
		if (this.parent)
			return this.parent.assetIndexUrl();

		console.error("ERROR: Failed to find asset index");
		return null;
	}

	/**
	 * Get the path of the asset index
	 * @return {String}
	 */
	assetIndexPath() {
		if (this.assetIndex != undefined)
			return config.minecraftPath().path('assets/indexes/' + this.assetIndex.id + '.json');

		if (this.parent)
			return this.parent.assetIndexPath();

		console.error("ERROR: Failed to find asset path");
		return null;
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