const jetpack = require('fs-jetpack');
const {spawn} = require('child_process');
const isRunning = require('is-running');

const config = require('../config');
const utils = require('../utils/utils');

class MinecraftInstance {

	/**
	 * Create a new Minecraft instance
	 * @param  {String} javaPath
	 * @param  {String} clientToken
	 * @param  {Account} account
	 * @param  {Profile} profile
	 * @param  {Version} version
	 * @param  {String} tempPath
	 */
	constructor(javaPath, clientToken, account, profile, version, tempPath) {
		this._javaPath    = javaPath
		this._clientToken = clientToken;
		this._profile     = profile;
		this._version     = version;
		this._account     = account;
		this._tempPath    = tempPath;

		this._process = null;
		this._pid     = null;
		this._started = false;
	}

	/**
	 * Generate the library arguments
	 * @return {Array<String>}
	 */
	generateLibraryArgs() {
		var args = [
			'-Djava.library.path=' + this._tempPath,
			'-Dminecraft.client.jar=' + this._version.jarPath(),
			'-Dminecraft.launcher.brand=intercraft-launcher',
			'-cp'
		];

		var libraries = this._version.libraries();
		var libraryString = "";
		var separator = (utils.os() == 'windows') ? ';' : ':';
		for (var i = 0; i < libraries.length; i++)
			if (!libraries[i].needsExtraction())
				libraryString += libraries[i].path() + separator;
		libraryString += this._version.jarPath();

		args.push(libraryString);
		return args;
	}

	/**
	 * Generate the arguments given from the version
	 * @return {Array<String>}
	 */
	generateVersionArgs() {
		var argValues = {
			"assets_root":       config.minecraftPath().path('assets'), // Should probably be settable, but I'm not worried about at the moment
			"assets_index_name": this._version.assetsId(),
			"auth_access_token": this._account.accessToken(),
			"auth_player_name":  this._account.username(),
			"auth_uuid":         this._account.uuid(),
			"game_directory":    this._profile.gameDirectory(),
		};
		return this._version.arguments(argValues);
	}

	/**
	 * Start the given Minecraft instance
	 * @param {Function} callback
	 * @return {Undefined}
	 */
	start(callback) {
		if (this._started) {
			console.log("WARNING: Attempted to start an already started/starting instance of Minecraft");
			return callback(false);
		}

		console.log("Launching Minecraft instance");
		this.started = true;

		var args = [];
		var javaPath    = this._profile.javaPath();
		var javaArgs    = this._profile.javaArgs();
		var libraryArgs = this.generateLibraryArgs();
		var mainClass   = this._version.mainClass();
		var versionArgs = this.generateVersionArgs();

		args = args.concat(javaArgs)
		           .concat(libraryArgs)
		           .concat(mainClass)
		           .concat(versionArgs);

		this.createProcess(javaPath, args, this._profile.gameDirectory());
	}

	/**
	 * Create the actual Minecraft process
	 * @param  {String}        javaPath
	 * @param  {Array<String>} args
	 * @param  {String}        cwd
	 * @return {Undefined}
	 */
	createProcess(javaPath, args, cwd) {

		// Uncomment the line below to debug the Minecraft start command
		// console.log(`Launching with the command:\n"${javaPath}" ` + args.join(' '));

		this._process = spawn(javaPath, args, {
			cwd: cwd,
			detached: true
		});

		this._process.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		this._process.stderr.on('data', (data) => {
			console.log(`ps stderr: ${data}`);
		});

		this._process.stdout.on('close', (code) => {
			console.log(`Closed with exit code ${code}`);
		});

		this._pid = this._process.pid;
	}
}

exports.MinecraftInstance = MinecraftInstance;