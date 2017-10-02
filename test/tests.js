const async    = require("async");
const test     = require("test");
const {Config} = require("../src/core/config");
const {Locale} = require("../src/core/locale");

function start() {
	var tests = [
		require("./tests/event_manager"),
		require("./tests/find_java"),
		require("./tests/launcher_profile_manager"),
		require("./tests/web_services")
	];
	var result = {};
	for (t in tests) {
		for (k in tests[t]) {
			result[k] = tests[t][k];
		}
	}
	test.run(result);
}

async.waterfall([
		(cb) => { Config.init(cb); },
		(cb) => { Locale.init(cb); }
	],
	(err) => {
		if (err)
			console.log("Failed to initialize tests");
		else {
			start();
		}
	}
);