const fs = require('fs');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const os = require('os');

var config;

var javaHome;
var rootPath = jetpack;
var dataPath = function() {
	var path = jetpack.cwd(os.homedir());
	if (process.platform == 'win32')
		path = path.cwd('./AppData/Roaming');
	return path;
}();

require('find-java-home')((err, home) => {
	if (err)
		return console.error("Could not find java installation!");
	javaHome = jetpack.cwd(home);
});

var generate = function() {
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
};

exports.save = function() {
	jsonfile.writeFile(rootPath.path('./config.json'), config);
};

exports.minecraftPath = function() {
	return jetpack.cwd(config['minecraft_path']);
};

exports.setMinecraftPath = function(path) {
	config['minecraft_path'] = path;
};

exports.tempPath = function() {
	var path;
	if (process.platform == 'win32')
		path = dataPath.cwd('../Local/Temp');
	else
		path = jetpack.cwd('/tmp');
	return path;
};

exports.javaPath = function() {
	if (process.platform == 'win32')
		return javaHome.cwd('bin/java.exe');
	return javaHome.cwd('bin/java');
};

exports.accessToken = function() {
	return config['access_token'];
};

exports.setAccessToken = function(token) {
	config['access_token'] = token;
	exports.save();
};

exports.uuid = function() {
	return config['uuid'];
}

exports.altUuids = function() {
	return config['alt_uuids'];
}