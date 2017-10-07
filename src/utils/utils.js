const jetpack  = require("fs-jetpack");
const Registry = require("winreg");

/**
 * Attempt to find Minecraft's installation directory (Windows only)
 * @return {Undefined}
 */
function findMinecraftInstallation(callback)
{
	let regKey = new Registry({
		hive: Registry.HKLM,
		key: "\\SOFTWARE\\WOW6432Node\\Mojang\\Minecraft"
	});
	regKey.values((err, items) => {
		if (err)
			return callback(null);
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == "REG_SZ" && jetpack.exists(items[i].value) == "dir") {
				if (jetpack.exists(jetpack.cwd(items[i].value).path("MinecraftLauncher.exe")))
					return callback(jetpack.path(items[i].value));
			}
		}
		callback(null);
	});
}

/**
 * Locate Minecraft's javaw.exe (Windows only)
 * @param  {Function} callback
 * @return {Undefined}
 */
function findMinecraftJava(callback, path)
{
	var find = (path) => {
		var runtimePath = jetpack.cwd(path).path("runtime", "jre-x64")
		var dirs = jetpack.list(runtimePath);
		if (dirs && dirs.length > 0) {
			var javaPath = jetpack.cwd(runtimePath).path(dirs[0], "bin/javaw.exe");
			return callback(jetpack.exists(javaPath) == "file" ? javaPath : null);
		}
		callback(null);
	}
	if (path)
		find(path);
	else
		findMinecraftInstallation(find)
}

/**
 * Generate a random hexadecimal string
 * @param  {Integer} length
 * @return {Undefined}
 */
function randomHexString(length) {
	var chars = "0123456789abcdef";
	var result = "";
	for (var i = 0; i < length; i++)
		result += chars[Math.floor(Math.random()*chars.length)];
	return result;
}

/**
 * Generate a random partitioned hexadecimal string
 * @return {String}
 */
function randomHexStringPartitioned() {
	var result = randomHexString(8);
	var partitions = [4, 4, 4, 12];
	for (var i = 0; i < partitions.length; i++)
		result += `-${randomHexString(partitions[i])}`;
	return result;
}

/**
 * Determine if a string is a hexadecimal string
 * @param  {String} string
 * @return {Boolean}
 */
function isHexString(string) {
	var re = /[0-9a-f]+/g;
	var result = string.match(re);
	return Boolean(result && result[0] == string);
}

/**
 * Determine if a string is a partitioned hexadecimal string
 * @param  {String} string
 * @return {Boolean}
 */
function isHexStringPartitioned(string) {
	var re = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
	var result = string.match(re);
	return Boolean(result && result[0] == string);
}

/**
 * Determine if a string is a valid 32 character hexadecimal string
 * @param  {String} id
 * @return {Boolean}
 */
function isMinecraftIdentifier(id) {
	return id.length == 32 && isHexString(id);
}

/**
 * Determine if a string is a valid Minecraft username
 * @param  {String} username
 * @return {Boolean}
 */
function isValidMinecraftUsername(username) {
	var re = /[0-9A-Za-z_]/g;
	var result = string.match(re);
	return Boolean(result && result[0] == username) &&
	       username.length >= 3 && username.length <= 16;
}

// Export methods
module.exports = {
	findMinecraftInstallation:  findMinecraftInstallation,
	findMinecraftJava:          findMinecraftJava,
	randomHexString:            randomHexString,
	randomHexStringPartitioned: randomHexStringPartitioned,
	isHexString:                isHexString,
	isHexStringPartitioned:     isHexStringPartitioned
};