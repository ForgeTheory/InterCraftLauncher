
class MinecraftInstance {
	constructor(clientToken, account, profile, version, tempPath) {
		this.clientToken = clientToken;
		this.profile = profile;
		this.version = version;
		this.account = account;
		this.tempPath = tempPath;
	}

	start() {
		console.log("Starting OMG!!!");
	}
}

exports.MinecraftInstance = MinecraftInstance;