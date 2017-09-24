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

module.exports = {
	findMinecraftJava: findMinecraftJava,
	findMinecraftInstallation, findMinecraftInstallation
};