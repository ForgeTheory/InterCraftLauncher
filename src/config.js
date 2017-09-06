const findJava = require('./utils/find_java');
const fs = require('fs');
const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const os = require('os');

const locale = require('./locale');

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
	console.log("Generating configuration");
	config = {
		"java": null,
		"locale": null,
		"minecraft_path": minecraftPath(),
		"access_token": null
	};
};

exports.init = function(callback) {
	
	// Load/generate the configuration
	exports.load();

	// Locate the Java installation
	findJava((err, home) => {
		if (err)
			return callback(false);
		else
			javaHome = jetpack.cwd(home);
		callback(false);
	});
};

exports.load = function() {
	// Open the configuration
	if (fs.existsSync(rootPath.path('config.json'))) {
		config = jsonfile.readFileSync(rootPath.path('./config.json'), {throws: false});
	}
	// If there was an error, generate a new configuration
	if (config == null) {
		generate();
		exports.save();
	}
};

exports.save = function() {
	jsonfile.writeFile(rootPath.path('./config.json'), config);
};

exports.locale = function() {
	return config["locale"];
};

exports.setLocale = function(locale) {
	config["locale"] = locale;
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
