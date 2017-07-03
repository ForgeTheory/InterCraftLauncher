const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const cache = require('../cache');
const config = require('../config');
const downloadManager = require('../utils/download_manager')
const minecraft = require('./minecraft');
const versionManager = require('./version_manager');

const MinecraftInstance = require('./minecraft_instance').MinecraftInstance;

class LaunchTask {
	constructor(clientToken, account, profile, version) {
		this._clientToken = clientToken;
		this._account = account;
		this._profile = profile;
		this._version = version;
		this._starting = false;
		this._finishedCallback = undefined;
		this._libraries = [];
		this._tempPath = cache.createTempPath();
	}

	/**
	 * Initiate a launch task, call the callback with the result when ready
	 * @return {Undefined}
	 */
	start(callback) {
		if (this._starting) {
			console.log("WARNING: Attempted to start an already starting Minecraft instance");
			return;
		}
		this._starting = true;
		this._finishedCallback = callback;
		this._version.resolveInheritance((result) => {
			this.onInheritanceResolved(result);
		});
	}

	/**
	 * Execute when the version's inheritance has been resolved
	 * @param  {Boolean} result
	 * @return {Undefined}
	 */
	onInheritanceResolved(result) {
		if (!result)
			this.cleanAndFinish(false);

		this._version.resolveLibraries((libraries) => {
			this.onLibrariesResolved(libraries);
		});
	}

	/**
	 * Execute after resolving all required libraries
	 * @param  {Array} libraries
	 * @return {Undefined}
	 */
	onLibrariesResolved(libraries) {
		this._libraries = libraries;
		this.installDependencies();
	}

	/**
	 * Install any missing libraries from the list
	 * @return {[undefined]}
	 */
	installDependencies() {
		var toInstall = {};
		
		// Main jar file
		if (jetpack.exists(this._version.jarPath()) != 'file') {
			if (this._version.jarUrl())
				toInstall[this._version.jarUrl()] = this._version.jarPath();
		}

		// Libraries
		for (var i = 0; i < this._libraries.length; i++) {
			if (!this._libraries[i].isInstalled())
				if (this._libraries[i].downloadUrl() != undefined)
					toInstall[this._libraries[i].downloadUrl()] = this._libraries[i].path();
		}

		if (Object.keys(toInstall).length > 0) {
			console.log("Installing", Object.keys(toInstall).length, "dependencies");
			downloadManager.downloadList(toInstall, (result) => {
				if (result) {
					this._version.loadAssetIndex((assetIndex) => {
						this.installAssets(assetIndex);
					});
				}
				else
					this.cleanAndFinish(false);
			});
		}
		else {
			console.log("No dependencies to install");
			this._version.loadAssetIndex((assetIndex) => {
				this.installAssets(assetIndex);
			});
		}
	}

	/**
	 * Install the assets from the asset index
	 * @return {[type]} [description]
	 */
	installAssets(assetIndex) {
		console.log("Finding assets");
		var assets = assetIndex.assets();
		var toInstall = {};

		for (var i = 0; i < assets.length; i++) {
			if (!assets[i].isInstalled())
				toInstall[assets[i].url()] = assets[i].path();
		}

		console.log("Downloading assets...");
		downloadManager.downloadList(toInstall, (result) => {
			if (result) {
				console.log("Assets installed successfully!");
				this.extractDependencies();
			} else {
				console.error("Assets failed to install");
				this.cleanAndFinish(false);
			}
		});
	}

	/**
	 * Extract the necessary dependencies
	 * @return {Undefined}
	 */
	extractDependencies() {
		var tempPath = this._tempPath;
		var dependencies = [];
		for (var i = 0; i < this._libraries.length; i++)
			if (this._libraries[i].needsExtraction())
				dependencies.push(this._libraries[i]);
		
		var nextLib = function(launchTask, libraries) {
			if (libraries.length == 0)
				return launchTask.cleanAndFinish(true);

			libraries[0].extract(tempPath, () => {
				nextLib(launchTask, libraries.slice(1));
			});
		};
		nextLib(this, dependencies);
	}

	/**
	 * Clean the launch task after start attempt, and give a result
	 * @param  {Boolean} result
	 * @return {Undefined}
	 */
	cleanAndFinish(result) {
		var minecraftInstance = new MinecraftInstance(config.javaPath().path(), this._clientToken, this._account, this._profile, this._version, this._tempPath);
		this._starting = false;
		this._finishedCallback(this, result, minecraftInstance);
	}
}

exports.LaunchTask = LaunchTask;