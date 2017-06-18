const downloadFile = require('download-file');

var dir = "C:/Users/David/Desktop/";

exports.download = function() {
	downloadFile(
			"https:\/\/launchermeta.mojang.com\/mc\/game\/870bdfd6ea61ee9cccedab53b28650c68c9cb410\/1.12-pre7.json",
			{'directory':  dir},
			(error) => {
				if (error)
					console.error("Error: Failed to download Minecraft version", version.id);
			}
		);
}