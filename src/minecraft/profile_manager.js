const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('../config');
const utils = require('../utils/utils');
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

/**
 * Initialize the profile manager
 * @return {Boolean}
 */
exports.init = function() {

	// Save the path
	path = config.minecraftPath().path('launcher_profiles.json');

	// Load the file
	exports.load(config.minecraftPath().path('launcher_profiles.json'));

	// Return success
	return true;
};

/**
 * Load the launcher profiles
 * @return {Undefined}
 */
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

/**
 * Save the launcher profiles
 * @return {Undefined}
 */
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

/**
 * Parse the given launcher profiles version
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
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

/**
 * Parse the launcher profile settings
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
var parseSettings = function(launcherProfile) {
	settings = launcherProfile.settings;
};

/**
 * Parse the given launcher profiles
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
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

/**
 * Parse the client token
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
var parseClientToken = function(launcherProfile) {
	if (launcherProfile.clientToken != undefined) {
		clientToken = launcherProfile.clientToken;
		return;
	}
	exports.generateClientToken();
};

/**
 * Parse the analytics token (not really used, just don't want to lose it)
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
var parseAnalytics = function(launcherProfile) {
	analytics = {
		failCount: launcherProfile.analyticsFailcount,
		token: launcherProfile.analyticsToken
	}
};

/**
 * Parse the accounts
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
var parseUserAccounts = function(launcherProfile) {
	accounts = {};
	if (version.name.startsWith('1'))
		return parseUserAccountsLegacy(launcherProfile);

	if (launcherProfile.authenticationDatabase == undefined)
		launcherProfile.authenticationDatabase = {};

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

/**
 * Parse the accounts in the legacy version
 * @param  {Json Object} launcherProfile
 * @return {Undefined}
 */
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

/**
 * Generate a client token
 * @return {Undefined}
 */
exports.generateClientToken = function() {
	clientToken = utils.randomHexStringPartitioned([8, 4, 4, 4, 12]);
};

/**
 * Get the client token
 * @return {String}
 */
exports.clientToken = function() {
	return clientToken;
}

/**
 * Sort the profiles by the last used date
 * @return {Undefined}
 */
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

/**
 * Use the given profile
 * @param  {Profile} profile
 * @return {Undefined}
 */
exports.use = function(profile) {
	profile.setLastUsed();
	exports.save();
};

/**
 * Fetch a profile from the profile key
 * @param  {String} key
 * @return {Profile|Null}
 */
exports.profile = function(key) {
	for (var i = 0; i < profiles.length; i++)
		if (profiles[i].key() == key)
			return profiles[i];
	return null;
};

/**
 * Get the full list of the profiles
 * @return {Array<Profile>}
 */
exports.profiles = function() {
	return profiless;
};

/**
 * Generate the list of available profiles sorted by 'last used' date
 * @return {Array<Profile>}
 */
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

/**
 * Get the active account
 * @return {Account|Null}
 */
exports.activeAccount = function() {
	if (!this.selectedUser) {
		if (Object.keys(accounts).length > 0)
			return exports.accounts()[0];
	}
	else if (accounts[this.selectedUser])
		return accounts[this.selectedUser];

	console.error("No active account available");
	return null;
};

/**
 * Get the full list of accounts
 * @return {Array<Account>}
 */
exports.accounts = function() {
	var results = [];
	var keys = Object.keys(accounts);
	for (var i = 0; i < keys.length; i++)
		results.push(accounts[keys[i]]);
	return results;
};

/**
 * Add an account
 * @param {Account} account
 */
exports.addAccount = function(account) {
	accounts.push(account);
};

/**
 * Remove an account
 * @param  {Account} account
 * @return {Boolean}
 */
exports.removeAccount = function(account) {
	var index = accounts.indexOf(account);
	if (index > -1) {
		accounts.splice(index, 1);
		return true;
	}
	return false;
};
