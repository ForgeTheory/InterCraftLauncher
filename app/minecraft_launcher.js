(function () {'use strict';

const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const download = require('download-file');
const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const {spawn} = require('child_process');
const isRunning = require('is-running');

const config = require('./config');
const minecraft = require('./minecraft');

let sessions = {};

var operatingSystem = function() {
	if (process.platform == 'win32')
		return 'windows';
	else if (process.platform == 'darwin')
		return 'osx';
	return 'linux';
};

var generateSession = function() {
	var chars = '0123456789abcdef';
	var id = '';
	var path;
	for (var i = 0; i < 19; i++)
		if (i > 1 && (i+1)%5 == 0)
			id += '-';
		else
			id += chars[Math.floor(Math.random()*16)];

	// Create the path
	path = config.tempPath().path(id);
	
	// Create the temp directory
	jetpack.dir(path);

	sessions[id] = {
		'launcherProfile': undefined,
		'profile': undefined,
		'version': undefined,
		'totalLibraries': 0,
		'libraries': [],
		'ready': false,
		'launched': false,
		'javaDir': config.javaPath().path(),
		'tempPath': path,
		'gameDir': config.minecraftPath().path(),
		'jarPath': '',
		'jvmArgs': '',
		'minecraftAccount': minecraft.selectedAccount().account,
		'pid': null
	};

	exports.saveSessions();

	return id;
};

exports.saveSessions = function() {
	var sess = JSON.parse(JSON.stringify(sessions));
	var keys = Object.keys(sess);

	for (var i = 0; i < keys.length; i++) {
		delete sess[keys[i]].profile;
		delete sess[keys[i]].version;
	}

	console.log(sess);

	jsonfile.writeFile('./sessions.json', sess, {spaces: 2}, (err) => {
		if (err)
			console.error("Error saving sessions:", err);
	});
};

exports.init = function() {
	console.log("Loading launcher sessions...");
	if (jetpack.exists('./sessions.json')) {
		sessions = jsonfile.readFileSync('./sessions.json');
		var keys = Object.keys(sessions);
		for (var i = 0; i < keys.length; i++) {
			loadLauncherProfile(sessions[keys[i]].launcherProfile, keys[i]);
			loadVersionInfo(sessions[keys[i]].profile, keys[i]);
		}
		exports.clean();
	} else
		sessions = {};
};

exports.clean = function() {
	var keys = Object.keys(sessions);
	console.log("The keys are", keys, sessions);
	for (var i = 0; i < keys.length; i++) {
		if (isRunning(sessions[keys[i]].pid)) {
			console.log("Found running MC");
		} else {
			jetpack.remove(config.tempPath().path(keys[i]));
			delete sessions[keys[i]];
		}
	}
	exports.saveSessions();
};

exports.preLaunch = function(launcherProfile, callback) {

	console.log("Initiating prelaunch...");

	var sessionId = generateSession();
	sessions[sessionId].launcherProfile = launcherProfile;
	var profile = loadLauncherProfile(launcherProfile, sessionId);

	// Set the game directory
	if (profile.gameDir != undefined)
		sessions[sessionId].gameDir = profile.gameDir;

	// Parse differently if latest release/snapshot
	if (profile.type == 'latest-release')
		return latestRelease(profile, callback);
	else if (profile.type == 'latest-snapshot')
		return latestSnapshot(profile, callback);

	// Check if a java directory is specified
	if (profile.javaDir != undefined)
		sessions[sessionId].javaDir = profile.javaDir;

	// Check if any java args are set
	if (profile.javaArgs != undefined)
		sessions[sessionId].jvmArgs = profile.javaArgs; 

	// Get the selected version from the launcher profile
	var version = loadVersionInfo(profile, sessionId);

	var versionId;
	if (version.inheritsFrom != undefined) {
		// Really a check needs to be here to download the version if necessare
		versionId = version.inheritsFrom;
		var libs = minecraft.installedVersions()[versionId].libraries;
		version.libraries = version.libraries.concat(libs);
	}
	else 
		versionId = version.id;
	sessions[sessionId].jarPath = config.minecraftPath().cwd('versions').cwd(versionId).path(versionId + '.jar');

	// Parse the libraries
	prepareLibraries(version.libraries, sessionId);
};

var loadLauncherProfile = function(profile, sessionId) {
	sessions[sessionId].profile = minecraft.profiles()[profile];
	return sessions[sessionId].profile;
};

var loadVersionInfo = function(profile, sessionId) {
	sessions[sessionId].version = minecraft.installedVersions()[profile.lastVersionId];
	return sessions[sessionId].version;
};

var launch = function(sessionId) {
	console.log("Launching...");
	var session = sessions[sessionId];

	if (session.launched)
		return;
	session.launched = true;


	var i;
	var javaDir = session.javaDir;
	var gameDir = session.gameDir;
	var assetsRoot = jetpack.cwd(gameDir).path('assets');
	var jvmArgs = session.jvmArgs.split(' ');
	var username = minecraft.accountUsername(session.minecraftAccount);
	var libraries = session.libraries.join(';') + ';' + session.jarPath;
	var version = session.profile.lastVersionId;
	var mcArgs = session.version.minecraftArguments.split(" ");
	var mcArgValues = {
		"${auth_player_name}": username,
		"${version_name}": version,
		"${game_directory}": gameDir,
		"${assets_root}": assetsRoot,
		"${assets_index_name}": session.version.assets,
		"${auth_uuid}": minecraft.accountUuid(session.minecraftAccount),
		"${auth_access_token}": minecraft.accountAccessToken(session.minecraftAccount),
		"${user_type}": "mojang",
		"${version_type}": session.version.type
	};

	var index;
	var keys = Object.keys(mcArgValues);
	for (i = 0; i < keys.length; i++) {
		index = mcArgs.indexOf(keys[i]);
		if (index > -1)
			mcArgs[index] = mcArgValues[keys[i]];
	}

	var args = [];

	for (i = 0; i < jvmArgs.length; i++) {
		if (jvmArgs[i].trim().length > 0)
			args.push(jvmArgs[i]);
	}

	args.push("-Djava.library.path=" + session.tempPath);
	args.push("-cp");
	args.push(libraries);
	args.push(session.version.mainClass);
	args = args.concat(mcArgs);

	var mcInstance = spawn(config.javaPath().path(), args, {
		cwd: session.gameDir,
		detached: true,
	});

	mcInstance.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	mcInstance.on('close', (code) => {
		exports.clean();
	});

	session.pid = mcInstance.pid;

	exports.saveSessions();
};

var latestRelease = function(profile, callback) {

};

var latestSnapshot = function(profile, callback) {

};

var prepareLibraries = function(libraries, sessionId) {
	for (var i = 0; i < libraries.length; i++) {
		prepareLibrary(libraries[i], sessionId);
	}

	sessions[sessionId].ready = true;
	console.log("Library count:", sessions[sessionId].totalLibraries, sessions[sessionId].libraries.length);
	if (sessions[sessionId].totalLibraries == sessions[sessionId].libraries.length)
		launch(sessionId);
};

var prepareLibrary = function(library, sessionId) {

	if (!isLibraryAllowed(library))
		return;

	var artifact = undefined;
	if (library.downloads != undefined) {
		if (library.natives == undefined) {
			if (library.downloads.artifact != undefined) {
				artifact = library.downloads.artifact;
			}
		} else {
			artifact = library.downloads.classifiers[library.natives[operatingSystem()]];
		}
	} else {
		sessions[sessionId].totalLibraries++;
		parseLocalDependency(library, sessionId);
		return;
	}

	// Parse the artifact if necessary
	if (artifact != undefined) {
		sessions[sessionId].totalLibraries++;
		parseArtifact(library, artifact, sessionId);
	}
};

var isLibraryAllowed = function(library) {
	var allowed = true;
	var rules = library.rules;

	if (rules == undefined)
		return true;

	for (var i = 0; i < rules.length; i++) {
		if (rules[i].action == 'allow')
			if (rules[i].os == undefined)
				allowed = true;
			else
				allowed = rules[i].os.name == operatingSystem();
		
		else if (rules[i].action == 'disallow') {
			if (rules[i].os == undefined)
				allowed = false;
			else
				allowed = rules[i].os.name != operatingSystem();
		}
	}
	return allowed;
};

var parseLocalDependency = function(library, sessionId) {
	var parts = library.name.split(':');
	var path = config.minecraftPath()
	                 .cwd('libraries')
	                 .cwd(parts[0].replace(/\./g, '/'))
	                 .cwd(parts[1])
	                 .cwd(parts[2])
	                 .cwd(parts[1] + '-' + parts[2] + '.jar');
	console.log("Parsed local dependency:", path.path());
	libraryFinished(path.path(), sessionId);
};

var parseArtifact = function(library, artifact, sessionId) {
	var artifactPath = minecraft.minecraftPath().cwd('libraries').cwd(artifact.path);
	console.log("Parsing artifact: ", library.name);
	if (jetpack.exists(artifactPath.path())) {
		if (library.extract != undefined)
			extractArtifact(library, artifact, artifactPath.path(), sessionId);
		else
			libraryFinished(artifactPath.path(), sessionId);
	} else {
		downloadLibrary(library, artifact, artifactPath.path(), sessionId);
	}
};

var downloadLibrary = function(library, artifact, artifactPath, sessionId) {
	console.log("Downloading library: ", library.name, artifactPath);

	// Download the file
	var path = jetpack.cwd(sessions[sessionId].gameDir).path(artifact.path);
	download(
		artifact.url,
		{'directory':  path},
		(error) => {
			if (error)
				console.error("Failed to download:", library.name);
			if (library.extract == undefined)
				libraryFinished(artifactPath, sessionId);
			else
				extractArtifact(library, artifact, artifactPath, sessionId);
		});
};

var extractArtifact = function(library, artifact, artifactPath, sessionId) {
	console.log("Extracting", library.name);

	var exclude;
	if (library.extract.exclude == undefined)
		exclude = [];
	else
		exclude = library.extract.exclude;

	fs.createReadStream(jetpack.cwd(sessions[sessionId].gameDir).cwd('libraries').path(artifact.path))
		.pipe(unzip.Parse())
		.on('entry', (entry) => {
			var fileName = entry.path;
			var type = entry.type; // 'Directory' or 'File' 
			var size = entry.size;

			if (exclude.indexOf(fileName) > -1) {
				console.log("Excluding", fileName);
				entry.autodrain();
				return;
			}

			if (type == 'Directory') {
				jetpack.dir(jetpack.cwd(sessions[sessionId].tempPath).path(fileName));
				entry.autodrain();
				return;
			}

			if (jetpack.exists(jetpack.cwd(sessions[sessionId].tempPath).cwd(fileName).path('../')))
				entry.pipe(fs.createWriteStream(jetpack.cwd(sessions[sessionId].tempPath).path(fileName)));
			else
				entry.autodrain();
		})
		.on('close', () => { libraryFinished(artifactPath, sessionId); });
};

var libraryFinished = function(artifactPath, sessionId) {
	sessions[sessionId].libraries.push(artifactPath);
	if (sessions[sessionId].totalLibraries == sessions[sessionId].libraries.length &&
		sessions[sessionId].ready)
		launch(sessionId);
};

}());
//# sourceMappingURL=minecraft_launcher.js.map