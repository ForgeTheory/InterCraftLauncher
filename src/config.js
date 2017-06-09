const fs = require('fs');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const os = require('os');

let config;

let rootPath = jetpack;
let dataPath = jetpack.cwd(os.homedir());

if (process.platform == 'win32') {
	dataPath = dataPath.cwd('./AppData/Roaming');
}

let generate = function() {
	config = {
		"configured": false,
		"minecraft_path": dataPath.path('.minecraft'),
		"access_token": null
	};
};

exports.init = function() {
	if (fs.existsSync(rootPath.path('config.json'))) {
		config = jsonfile.readFileSync(rootPath.path('./config.json'));
	} else {
		generate();
		exports.save();
	}
	return config['configured'];
}

exports.save = function() {
	jsonfile.writeFile(rootPath.path('./config.json'), config);
}

exports.minecraftPath = function() {
	return config['minecraft_path'];
}

exports.accessToken = function() {
	return config['access_token'];
}

exports.setAccessToken = function(token) {
	config['access_token'] = token;
	exports.save();
}

exports.uuid = function() {
	return config['uuid'];
}

exports.altUuids = function() {
	return config['alt_uuids'];
}