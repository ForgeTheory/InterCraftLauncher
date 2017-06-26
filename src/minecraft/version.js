const jetpack = require('fs-jetpack');

const versionManager = require('./version_manager');

const Library = require('./library').Library;

class Version {
	constructor(versionJson) {
		this.parseLibraries(versionJson.libraries);
	}

	parseLibraries(libraries) {
		this.libraries = [];
		for (var i = 0; i < libraries.length; i++) {
			var library = new Library(libraries[i]);
			if (library.isRequired()) {
				this.libraries.push(library);
				if (jetpack.exists(library.path()) == false)
					console.log("Path doesn't exist", library.name(), library.path());
			}
		}
	}
}

exports.Version = Version;