const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const downloadManager = require('../download_manager')
const minecraft = require('./minecraft');
const versionManager = require('./version_manager');

class LaunchTask {
	constructor(version) {
		this.starting = false;
		this.finishedCallback = undefined;
		this.version = version;
		this.libraries = [];
	}

	/**
	 * Initiate a launch task, call the callback with the result when ready
	 * @return {Undefined}
	 */
	start(callback) {
		if (this.starting) {
			console.log("WARNING: Attempted to start an already starting app");
			return;
		}
		this.starting = true;
		this.finishedCallback = callback;
		this.version.resolveInheritance((result) => {
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

		this.version.resolveLibraries((libraries) => {
			this.onLibrariesResolved(libraries);
		});
	}

	/**
	 * Execute after resolving all required libraries
	 * @param  {Array} libraries
	 * @return {Undefined}
	 */
	onLibrariesResolved(libraries) {
		this.libraries = libraries;
		this.installDependencies();
	}

	/**
	 * Install any missing libraries from the list
	 * @return {[undefined]}
	 */
	installDependencies() {
		var toInstall = {};
		
		// Main jar file
		if (jetpack.exists(this.version.jarPath()) != 'file') {
			if (this.version.jarUrl())
				toInstall[this.version.jarUrl()] = this.version.jarPath();
		}

		// Libraries
		for (var i = 0; i < this.libraries.length; i++) {
			if (!this.libraries[i].isInstalled())
				if (this.libraries[i].downloadUrl() != undefined)
					toInstall[this.libraries[i].downloadUrl()] = this.libraries[i].path();
		}

		if (Object.keys(toInstall).length > 0) {
			console.log("Installing", Object.keys(toInstall).length, "dependencies");
			return downloadManager.downloadList(toInstall, (result) => {
				if (result) {
					this.version.loadAssetIndex((assetIndex) => {
						this.installAssets(assetIndex);
					});
				}
				else
					this.cleanAndFinish(false);
			});
		}
		else {
			console.log("No dependencies to install");
			this.version.loadAssetIndex((assetIndex) => {
				this.installAssets(assetIndex);
			});
		}
	}

	/**
	 * Install the assets from the asset index
	 * @return {[type]} [description]
	 */
	installAssets(assetIndex) {
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
				this.cleanAndFinish(true);
			} else {
				console.error("Assets failed to install");
				this.cleanAndFinish(false);
			}
		});
	}

	/**
	 * Clean the launch task after start attempt, and give a result
	 * @param  {Boolean} result
	 * @return {Undefined}
	 */
	cleanAndFinish(result) {
		this.starting = false;
		this.finishedCallback(this, result);
	}
}

exports.LaunchTask = LaunchTask;