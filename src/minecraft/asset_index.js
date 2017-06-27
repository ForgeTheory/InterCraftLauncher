
const Asset = require('./asset').Asset;

class AssetIndex {
	constructor(assetIndexJson) {
		this.id = assetIndexJson.id;
		this.assetList = [];

		var keys = Object.keys(assetIndexJson);
		for (var i = 0; i < keys.length; i++) {
			for (var j = 0; j < Object.keys(assetIndexJson[keys[i]]).length; j++) {
				var assetKey = Object.keys(assetIndexJson[keys[i]])[j];
				this.assetList.push(new Asset(keys[i], assetIndexJson[keys[i]][assetKey]));
			}
		}
	}

	assets() {
		return this.assetList;
	}
}

exports.AssetIndex = AssetIndex;
