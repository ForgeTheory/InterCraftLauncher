const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('./config');
const launcher = require('./launcher/launcher');
const profileManager = require('./launcher/profile_manager');
const versionManager = require('./launcher/version_manager');

let minecraftDir;

exports.minecraftPath = function() {
	return minecraftDir;
};

exports.init = function() {
	var result = true;
	minecraftDir = config.minecraftPath();
	result = result && directoryExists();
	result = result && filesExist();
	result = result && profileManager.init();
	result = result && launcher.init();
	result = result && versionManager.init();

	return result;
};

exports.launcher = function() {
	return launcher;
};

exports.profileManager = function() {
	return profileManager;
}

var directoryExists = function() {
	return jetpack.exists(minecraftDir.path()) == 'dir';
};

var filesExist = function() {
	var result = true;
	result = result && jetpack.exists(minecraftDir.path('launcher_profiles.json'));
	return result;
};

var loadLauncherProfiles = function() {
	launcherProfiles = jsonfile.readFileSync(minecraftDir.path('launcher_profiles.json'), {throws: false});
	return launcherProfiles != null; // This is kinda bad, not telling the user that their launcher_profiles.json is corrupted
};

var initLauncherProfiles = function() {
	if (launcherProfiles.authenticationDatabase == undefined)
		launcherProfiles.authenticationDatabase = {};
};

var loadInstalledVersions = function() {
	installedVersions = {};
	var versionsDir = minecraftDir.cwd('versions');
	var folders = versionsDir.list();
	var file;
	for (var i = 0; i < folders.length; i++) {
		file = versionsDir.cwd(folders[i]).path(folders[i] + '.json')
		installedVersions[folders[i]] = jsonfile.readFileSync(file);
	}
};

exports.installedVersions = function() {
	return installedVersions;
};

exports.settings = function() {
	return launcherProfiles.settings;
};

exports.setSettings = function(settings) {
	launcherProfiles.settings = settings;
};

exports.clientToken = function() {
	return launcherProfiles.clientToken();
};

exports.generateClientToken = function() {
	var chars = '0123456789abcdef';
	var token = '';
	for (var i = 0; i < 36; i++)
		if (i>7 && i<24 && (i-8)%5 == 0)
			token += '-';
		else
			token += chars[Math.floor(Math.random()*16)];
	exports.setClientToken(token);
};

exports.setClientToken = function(token) {
	launcherProfiles.clientToken = token;
};

exports.profiles = function() {
	return launcherProfiles.profiles;
};

exports.setProfiles = function(profiles) {
	launcherProfiles.profiles = profiles;
};

exports.account = function(accountId) {
	return launcherProfiles.authenticationDatabase[accountId];
};

exports.accounts = function() {
	return launcherProfiles.authenticationDatabase;
};

exports.setAccount = function(id, data) {
	launcherProfiles.authenticationDatabase[id] = value;
};

exports.addAccount = function(id, accessToken, email, uuid, username) {
	var profile = {
		"accessToken": accessToken,
		"username": email,
		"profiles": {
		}
	};
	profile.profiles[uuid] = {
		"displayName": username
	};
	launcherProfiles.authenticationDatabase[id] = profile;
};

exports.selectedAccount = function() {
	return launcherProfiles.selectedUser;
};

exports.accountUsername = function(accountId) {
	return exports.account(accountId).profiles[exports.accountUuid(accountId)].displayName;
};

exports.accountUuid = function(accountId) {
	return Object.keys(exports.account(accountId).profiles)[0];
}

exports.accountAccessToken = function(accountId) {
	return exports.account(accountId).accessToken;
};

exports.save = function() {
	jsonfile.writeFileSync(minecraftDir.path('launcher_profiles.json'), launcherProfiles, {spaces: 2});
};