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

	exports.save();
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
	for (i = 0; i < accounts.length; i++) {
		if (!accounts[i].remember())
			continue;
		var key = (legacy) ? accounts[i].uuid() : accounts[i].userId();
		result.authenticationDatabase[key] = accounts[i].json(legacy);
	}

	// Selected Profile
	result.selectedProfile = selectedProfile;

	// Selected user
	if (legacy) {
		result.selectedUser = selectedUser;
	} else {
		for (i = 0; i < accounts.length; i++) {
			if (accounts[i].uuid() == selectedUser) {
				result.selectedUser = {
					account: accounts[i].userId(),
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
	accounts = [];
	if (version.name.startsWith('1'))
		return parseUserAccountsLegacy(launcherProfile);

	if (launcherProfile.authenticationDatabase == undefined)
		launcherProfile.authenticationDatabase = {};

	var userIds = Object.keys(launcherProfile.authenticationDatabase);
	for (var i = 0; i < userIds.length; i++) {
		console.log("Adding account");
		var account = launcherProfile.authenticationDatabase[userIds[i]];
		var uuid = Object.keys(account.profiles)[0];
		accounts.push(new Account({
			username: account.profiles[uuid].displayName,
			accessToken: account.accessToken,
			userId: userIds[i],
			uuid: uuid,
			email: account.username
		}));
	}

	if (launcherProfile.selectedUser != undefined)
		selectedUser = launcherProfile.selectedUser.profile;
	else if (accounts.length > 0) {
		console.log("Found an account");
		selectedUser = accounts[0].uuid();
	} else
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
		accounts.push(new Account({
			username: account.displayName,
			accessToken: account.accessToken,
			userId: account.userid,
			uuid: uuids[i],
			email: account.username
		}));

	if (launcherProfile.selectedUser != undefined)
		selectedUser = launcherProfile.selectedUser;
	else if (accounts.length > 0) {
		console.log("Found an account");
		selectedUser = accounts[0].uuid();
	} else
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
	return profiles;
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
	if (selectedUser) {
		for (var i = 0; i < accounts.length; i++)
			if (accounts[i].uuid() == selectedUser)
				return accounts[i];
	}
	if (accounts.length > 0)
		return accounts[0];

	console.error("No active account available");
	return null;
};

/**
 * Get the full list of accounts
 * @return {Array<Account>}
 */
exports.accounts = function() {
	var results = [];
	for (var i = 0; i < accounts.length; i++)
		results.push(accounts[i]);
	return results;
};

/**
 * Get the full list of accounts in Json format
 * @return {Json Object}
 */
exports.accountsAvailable = function() {
	var results = {
		active: null,
		accounts: {}
	};

	var account = exports.activeAccount();
	console.log(account);
	if (account) {
		results.active = {
			'email'   : account.email(),
			'username': account.username(),
			'uuid'    : account.uuid()
		};
	}

	for (var i = 0; i < accounts.length; i++) {
		results.accounts[accounts[i].username()] = ({
			'email'   : accounts[i].email(),
			'username': accounts[i].username(),
			'uuid'    : accounts[i].uuid()
		});
	}
	return results;
};

/**
 * Add an account
 * @param {Account} account
 */
exports.addAccount = function(account) {
	if (account.remember())
		selectedUser = account.uuid();
	for (var i = 0; i < accounts.length; i++) {
		if (accounts[i].userId() == account.userId()) {
			accounts[i] = account;
			return exports.save();
		}
	}
	accounts.push(account);
	exports.save();
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
