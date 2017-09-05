const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const stringArgv = require('string-argv');

const config = require('../config');
const downloadManager = require('../utils/download_manager');
const versionManager = require('./version_manager');

const {AssetIndex} = require('./asset_index');
const {Library} = require('./library');

class Version {
	constructor(versionJson) {
		this._id = versionJson.id;
		this._jar = versionJson.jar;
		this._parent = null;
		this._parentVersion = versionJson.inheritsFrom;
		this._libraries = undefined;
		this._downloads = versionJson.downloads;
		this._assetIndex = versionJson.assetIndex;
		this._assetIndexObj = undefined;
		this._assets = versionJson.assets;
		this._args = versionJson.minecraftArguments;
		this._mainClass = versionJson.mainClass;
		this._type = versionJson.type;

		this.parseLibraries(versionJson.libraries);
	}

	/**
	 * Convert the libraries from JSON to Library objects
	 * @param  {Json Object} libraries
	 * @return {Undefined}
	 */
	parseLibraries(libraries) {
		this._libraries = [];
		for (var i = 0; i < libraries.length; i++) {
			var library = new Library(libraries[i]);
			if (library.isRequired())
				this._libraries.push(library);
		}
	}

	/**
	 * Resolve the version's inheritance
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	resolveInheritance(callback) {

		if (this._parentVersion != undefined) {
			versionManager.loadVersion(this._parentVersion, (version) => {
				if (version) {
					this._parent = version;
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

		libraries = libraries.concat(this._libraries);

		if (this._parent)
			return this._parent.resolveLibraries(callback, libraries);

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
					this._assetIndexObj = new AssetIndex(obj);
					callback(this._assetIndexObj);
				});
			});
			return;
		}

		// Open the asset file
		jsonfile.readFile(this.assetIndexPath(), (err, obj) => {
			if (err) {
				console.log("ERROR: Failed to load asset index");
				return callback(null);
			}
			this._assetIndexObj = new AssetIndex(obj);
			callback(this._assetIndexObj);
		});
	}

	/**
	 * Get the url of the asset index
	 * @return {String}
	 */
	assetIndexUrl() {
		if (this._assetIndex != undefined)
			return this._assetIndex.url;
		
		if (this._parent)
			return this._parent.assetIndexUrl();

		console.error("ERROR: Failed to find asset index");
		return null;
	}

	/**
	 * Get the path of the asset index
	 * @return {String}
	 */
	assetIndexPath() {
		console.log(this._assetIndex);
		if (this._assetIndex != undefined)
			return config.minecraftPath().path('assets/indexes/' + this._assetIndex.id + '.json');

		if (this._parent)
			return this._parent.assetIndexPath();

		console.error("ERROR: Failed to find asset path");
		return null;
	}

	/**
	 * Get the asset index name
	 * @return {String}
	 */
	assetsId() {
		if (this._assets)
			return this._assets;
		else if (this._parent)
			return this._parent.assetsId();
		console.error("ERROR: Failed to find assets ID");
		return undefined;
	}

	/**
	 * Get the list of libraries
	 * @return {Array<Library>}
	 */
	libraries() {
		if (this._parent)
			return this._libraries.concat(this._parent.libraries());
		return this._libraries;
	}

	/**
	 * Search recursively for a jar URL
	 * @return {String|Undefined}
	 */
	jarUrl() {
		if (this._downloads != undefined && this._downloads.client != undefined)
			return this._downloads.client.url;

		else if (this._parent)
			return this._parent.jarUrl();

		return undefined;
	}

	/**
	 * Search recursively for a jar path
	 * @return {String|Undefined}
	 */
	jarPath() {
		if (this._jar != undefined) 
			return jetpack.cwd(versionManager.versionDirectory(this._jar)).path(this._jar + '.jar');
		
		if (jetpack.exists(jetpack.cwd(versionManager.versionDirectory(this._id)).path(this._id + '.jar'))
		    || (this._downloads != undefined && this._downloads.client != undefined))
			return jetpack.cwd(versionManager.versionDirectory(this._id)).path(this._id + '.jar');

		if (this._parent)
			return this._parent.jarPath();

		console.log("ERROR: Failed to find a jar path");
		return undefined;
	}

	/**
	 * Get the main class
	 * @return {String}
	 */
	mainClass() {
		return this._mainClass
	}

	/**
	 * Get the arguments for the version
	 * @param  {Json Object} values
	 * @return {Array}
	 */
	arguments(values) {
		var argValues = {
			"${assets_root}":       '"' + values.assets_root + '"',
			"${assets_index_name}": values.assets_index_name,
			"${auth_access_token}": values.auth_access_token,
			"${auth_player_name}":  values.auth_player_name,
			"${auth_uuid}":         values.auth_uuid,
			"${game_directory}":    '"' + values.game_directory + '"',
			"${user_type}":         'mojang',
			"${version_name}":      this.version(),
			"${version_type}":      this.type()
		};

		var commandline = this._args;
		var keys = Object.keys(argValues);
		for (var i = 0; i < keys.length; i++)
			commandline = commandline.replace(keys[i], argValues[keys[i]]);

		return stringArgv(commandline);
	}

	/**
	 * Get the version type
	 * @return {String}
	 */
	type() {
		return this._type;
	}

	/**
	 * Get the version ID
	 * @return {String}
	 */
	version() {
		return this._id;
	}
}

module.exports = {Version};