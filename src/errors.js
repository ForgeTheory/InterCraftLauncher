var i = 0;

exports.NO_ERROR               = i++;
exports.INVALID_MINECRAFT_PATH = i++;
exports.NO_JAVA                = i++;
exports.LAUNCHER_SAVE_FAILED   = i++;

var messages = {};
messages[exports.INVALID_MINECRAFT_PATH] = "The configured Minecraft path is invalid";
messages[exports.NO_JAVA]                = "Could not find a Java installation on this machine";
messages[exports.LAUNCHER_SAVE_FAILED]   = "Failed to write Minecraft instances to disk";

exports.messages = messages;