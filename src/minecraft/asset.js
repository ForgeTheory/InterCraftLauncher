const jetpack = require('fs-jetpack');

const config = require('../config');

const RESOURCES_URL = "http://resources.download.minecraft.net";

class Asset {
	constructor(type, assetJson) {
		this._type = type;
		this._hash = assetJson.hash;
		this._size = assetJson.size;
	}

	/**
	 * Determine if this asset is installed
	 * @return {Boolean}
	 */
	isInstalled() {
		return jetpack.exists(this.path()) == 'file';
	}

	/**
	 * Get the asset's type
	 * @return {String}
	 */
	type() {
		return this._type;
	}

	/**
	 * Get the asset's hash
	 * @return {String}
	 */
	hash() {
		return this._hash;
	}

	/**
	 * Get the pre-hash of the asset (first two characters of the hash)
	 * @return {String}
	 */
	preHash() {
		return this._hash.substring(0, 2);
	}

	/**
	 * Get the URL of the asset
	 * @return {String}
	 */
	url() {
		return RESOURCES_URL + '/' + this.preHash() + '/' + this.hash();
	}

	/**
	 * Get the installation path of the asset
	 * @return {String}
	 */
	path() {
		return config.minecraftPath().cwd('assets').cwd(this._type).cwd(this.preHash()).path(this._hash);
	}
}

module.exports = {Asset};
