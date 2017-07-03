
const Asset = require('./asset').Asset;

class AssetIndex {
	constructor(assetIndexJson) {
		this._id = assetIndexJson.id;
		this._assetList = [];

		this.parseAssets(assetIndexJson);
	}

	// This causes a small lag spike in the GUI, needs a work around!!!
	/**
	 * Parse the asset
	 * @param  {Json Object} assetIndexJson
	 * @return {Undefined}
	 */
	parseAssets(assetIndexJson) {
		var keys = Object.keys(assetIndexJson);
		for (var i = 0; i < keys.length; i++) {
			for (var j = 0; j < Object.keys(assetIndexJson[keys[i]]).length; j++) {
				var assetKey = Object.keys(assetIndexJson[keys[i]])[j];
				this._assetList.push(new Asset(keys[i], assetIndexJson[keys[i]][assetKey]));
			}
		}
	}

	/**
	 * Get the name of the asset index
	 * @return {String}
	 */
	name() {
		return this._id;
	}

	/**
	 * Get the list of assets
	 * @return {Array<Asset>}
	 */
	assets() {
		return this._assetList;
	}
}

exports.AssetIndex = AssetIndex;
