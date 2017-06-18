
class Profile {
	constructor(key, profileJson) {
		this.profileKey = key;
		this.profile = profileJson;

		if (this.profileKey == undefined) {
			this.generateKey();
		}

		if (this.profile == undefined) {
			this.profile = {};
		}
	}

	generateKey() {
		this.profileKey = '';
		var chars = '0123456789abcdef';
		for (var i = 0; i < 32; i++)
			this.profileKey += chars[Math.floor(Math.random()*16)];
	}

	json() {
		var result = {};
		var keys = Object.keys(this.profile);

		if (keys.length == 0)
			return undefined;

		for (var i = 0; i < keys.length; i++)
			if (this.profile[keys[i]] != undefined)
				result[keys[i]] = this.profile[keys[i]];

		return result;
	}

	key() {
		return this.profileKey;
	}

	displayName() {
		if (this.profile.name != undefined)
			return this.profile.name;

		if (this.profile.type != undefined) {
			if (this.profile.type == 'latest-release')
				return "Latest Release";
			else if (this.profile.type == 'latest-snapshot')
				return "Latest Snapshot";
		}

		return null;
	}

	name() { return this.profile.name; }
	setName(name) {
		this.profile.name = name;
		return this;
	}

	type() { return this.profile.type; }
	setType(type) {
		this.profile.type = type;
		return this;
	}

	created() { return this.profile.created; }
	setCreated(created) {
		this.profile.created = created;
		return this;
	}

	lastUsed() { return this.profile.lastUsed; }
	setLastUsed(lastUsed) {
		this.profile.lastUsed = lastUsed;
		return this;
	}

	version() { return this.profile.lastVersionId; }
	setVersion(version) {
		this.profile.lastVersionId = lastVersionId;
		return this;
	}

	gameDirectory() { return this.profile.gameDir; }
	setGameDirectory(gameDir) {
		this.profile.gameDir = gameDir;
		return this;
	}

	javaDir() { return this.profile.javaDir; }
	setJavaDir(javaDir) {
		this.profile.javaDir = javaDir;
		return this;
	}

	javaArgs() { return this.profile.javaArgs; }
	setJavaArgs(javaArgs) {
		this.profile.javaArgs = javaArgs;
		return this;
	}
}

// Make class visible outside
exports.Profile = Profile;