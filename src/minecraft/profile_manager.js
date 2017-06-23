const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const utils = require('../utils');
const Account = require('./account').Account;
const Profile = require('./profile').Profile;

var path;

var accounts;
var analytics;
var clientToken;
var legacy;
var profiles;
var settings;
var selectedProfile;
var selectedUser;
var version;

exports.init = function() {

	// Save the path
	path = config.minecraftPath().path('launcher_profiles.json');

	// Load the file
	exports.load(config.minecraftPath().path('launcher_profiles.json'));

	// Return success
	return true;
};

exports.load = function() {

	// Clear the last profile
	version = undefined;
	profile = undefined;

	// Load the launcher profiles file
	var profile = jsonfile.readFileSync(path, {throws: false});

	// Display error if failed to load
	if (profile == null) {
		console.error("ERROR: Failed to load launcher profiles!", path);
		profile = {};
	}

	// Save the selected profile
	selectedProfile = profile.selectedProfile

	// Store the version for convenience.
	parseVersion(profile);

	// Parse the launcher settings
	parseSettings(profile);

	// Load the launcher profiles
	parseProfiles(profile);

	// Parse the client token
	parseClientToken(profile);

	// Parse analytics stuff (Just to store it)
	parseAnalytics(profile);

	// Parse the authentication database
	parseUserAccounts(profile);
};

exports.save = function() {

	console.log("Saving profiles...");

	var i = 0;
	var keys;

	// Start building the final result
	var result = {};

	// Settings
	if (settings != undefined) {
		result.settings = settings
	}

	// Launcher Version
	result.launcherVersion = version;

	// Client Token
	result.clientToken = clientToken;

	// Launcher Profiles
	console.log("Saving", profiles.length, "profile(s)");
	result.profiles = {};
	for (i = 0; i < profiles.length; i++)
		result.profiles[profiles[i].key()] = profiles[i].json();

	// Analytics
	if (analytics.failCount != undefined)
		result.analyticsFailcount = analytics.failCount;
	if (analytics.token != undefined)
		result.analyticsToken = analytics.token;

	// User Accounts
	result.authenticationDatabase = {};
	keys = Object.keys(accounts);
	for (i = 0; i < keys.length; i++) {
		var key = (legacy) ? keys[i] : accounts[keys[i]].userId();
		result.authenticationDatabase[key] = accounts[keys[i]].json();
	}

	// Selected Profile
	result.selectedProfile = selectedProfile;

	// Selected user
	if (legacy) {
		result.selectedUser = selectedUser;
	} else {
		keys = Object.keys(accounts);
		for (i = 0; i < keys.length; i++) {
			if (accounts[keys[i]].uuid() == selectedUser) {
				result.selectedUser = {
					account: accounts[keys[i]].userId(),
					profile: selectedUser
				};
				break;
			}
		}
	}

	console.log("Saving launcher profile");
	jsonfile.writeFile(path, result, {spaces: 2}, (error) => {
		if (error)
			console.error("ERROR: Failed to save launcher profile!", error);
	});
};

var parseVersion = function(launcherProfile) {

	// Check if the launcher version is defined
	if (launcherProfile.launcherVersion == undefined) {
		// Generate a launcher version
		version = {
			name: "2.0.934",
			format: 20,
			profilesFormat: 2
		};
	} else {
		// Load the version from the launcher
		version = launcherProfile.launcherVersion;
	}

	// Determine if the launcher uses legacy format
	legacy = version.name.startsWith('1');
};

var parseSettings = function(launcherProfile) {
	settings = launcherProfile.settings;
};

var parseProfiles = function(launcherProfile) {

	profiles = [];
	
	// Initialize the profile dictionary if none available
	if (launcherProfile.profiles == undefined)
		return;

	// Get the keys from the profile
	var profs = launcherProfile.profiles;
	var keys = Object.keys(profs);
	var i, j;

	for (i = 0; i < keys.length; i++) {
		profiles.push(new Profile(keys[i], profs[keys[i]]));
	}

	exports.sortProfiles();
};

var parseClientToken = function(launcherProfile) {
	if (launcherProfile.clientToken != undefined) {
		clientToken = launcherProfile.clientToken;
		return;
	}
	exports.generateClientToken();
};

var parseAnalytics = function(launcherProfile) {
	analytics = {
		failCount: launcherProfile.analyticsFailcount,
		token: launcherProfile.analyticsToken
	}
};

var parseUserAccounts = function(launcherProfile) {
	accounts = {};
	if (version.name.startsWith('1'))
		return parseUserAccountsLegacy(launcherProfile);

	var userIds = Object.keys(launcherProfile.authenticationDatabase);
	for (var i = 0; i < userIds.length; i++) {
		var account = launcherProfile.authenticationDatabase[userIds[i]];
		var uuid = Object.keys(account.profiles)[0];
		accounts[uuid] = new Account(false, {
			username: account.profiles[uuid].displayName,
			accessToken: account.accessToken,
			userId: userIds[i],
			uuid: uuid,
			email: account.username
		});
	}

	if (launcherProfile.selectedUser != undefined)
		selectedUser = launcherProfile.selectedUser.profile;
	else
		selectedUser = null;
};

var parseUserAccountsLegacy = function(launcherProfile) {
	// User IDs
	var uuids = Object.keys(launcherProfile.authenticationDatabase);
	for (var i = 0; i < uuids.length; i++) {
		var account = launcherProfile.authenticationDatabase[uuids[i]];
		accounts[uuids[i]] = new Account(true, {
			username: account.displayName,
			accessToken: account.accessToken,
			userId: account.userid,
			uuid: uuids[i],
			email: account.username
		});

		if (launcherProfile.selectedUser != undefined)
			selectedUser = launcherProfile.selectedUser;
		else
			selectedUser = null;
	}
}

exports.generateClientToken = function() {
	clientToken = utils.randomHexStringPartitioned([8, 4, 4, 4, 12]);
};

exports.sortProfiles = function() {
	var i, j;
	var profileList = [];
	var unused = [];

	for (i = 0; i < profiles.length; i++) {
		if (profiles[i].lastUsed() == undefined) {
			unused.push(profiles[i]);
			continue;
		}
		j = 0;
		while (j < profileList.length && profileList[j].lastUsed() > profiles[i].lastUsed())
			j++
		utils.arrayInsert(profileList, j, profiles[i]);
	}
	profiles = profileList.concat(unused);
};

exports.use = function(profile) {
	profile.setLastUsed();
	exports.save();
};

exports.profile = function(key) {
	for (var i = 0; i < profiles.length; i++)
		if (profiles[i].key() == key)
			return profiles[i];
	return null;
};

exports.profiles = function() {

};

// Generate the list of available profiles sorted by 'last used' date
exports.profilesAvailable = function() {
	var results = [];
	for (var i = 0; i < profiles.length; i++) {
		if (profiles[i].displayName() != null) {
			results.push({
				displayName: profiles[i].displayName(),
				key: profiles[i].key()
			});
		}
	}
	return results;
};

exports.accounts = function() {
	var results = [];
	var keys = Object.keys(accounts);
	for (var i = 0; i < keys.length; i++)
		results.push(accounts[keys[i]]);
	return results;
};

exports.addAccount = function(account) {
	accounts.push(account);
};

exports.removeAccount = function(account) {
	var index = accounts.indexOf(account);
	if (index > -1)
		accounts.splice(index, 1);
};
