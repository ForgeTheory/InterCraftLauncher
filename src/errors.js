var i = 1;

exports.NO_ERROR = 0;
exports.INVALID_MINECRAFT_PATH = i++;
exports.NO_JAVA = i++;

var messages = {};
messages[exports.INVALID_MINECRAFT_PATH] = "The configured Minecraft path is invalid";
messages[exports.NO_JAVA]                = "Could not find a Java installation on this machine";

exports.messages = messages;