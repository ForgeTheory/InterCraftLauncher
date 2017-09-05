const findJava = require('./utils/find_java');
const fs = require('fs');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const os = require('os');

const errors = require('./errors');

var config;

var javaHome;
var rootPath = jetpack;
var homeDir = jetpack.cwd(os.homedir());

var minecraftPath = function() {
	var path = homeDir;
	if (process.platform == 'win32')
		path = path.cwd('./AppData/Roaming/.minecraft');
	else if (process.platform == 'darwin')
		path = path.cwd('./Library/Application Support/minecraft');
	else
		path = path.cwd('.minecraft');
	return path.path();
};

var generate = function() {
	console.log("Generating stuff");
	config = {
		"java": null,
		"minecraft_path": minecraftPath(),
		"access_token": null
	};
};

exports.init = function(callback) {
	if (fs.existsSync(rootPath.path('config.json'))) {
		config = jsonfile.readFileSync(rootPath.path('./config.json'));
	} else {
		generate();
		exports.save();
	}

	findJava((err, home) => {
		if (err)
			return callback(errors.NO_JAVA);
		else
			javaHome = jetpack.cwd(home);
		callback(errors.NO_ERROR);
	});
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
		path = homeDir.cwd('./AppData/Local/Temp');
	else
		path = jetpack.cwd('/tmp');
	return path;
};

exports.javaPath = function() {
	return javaHome;
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
