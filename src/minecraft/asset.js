const jetpack = require('fs-jetpack');

const config = require('../config');

const RESOURCES_URL = "http://resources.download.minecraft.net";

class Asset {
	constructor(type, assetJson) {
		this.assetType = type;
		this.assetHash = assetJson.hash;
		this.assetSize = assetJson.size;
	}

	isInstalled() {
		return jetpack.exists(this.path()) == 'file';
	}

	type() {
		return this.assetType;
	}

	hash() {
		return this.assetHash;
	}

	preHash() {
		return this.assetHash.substring(0, 2);
	}

	url() {
		return RESOURCES_URL + '/' + this.preHash() + '/' + this.hash();
	}

	path() {
		return config.minecraftPath().cwd('assets').cwd(this.assetType).cwd(this.preHash()).path(this.assetHash);
	}
}

exports.Asset = Asset;
