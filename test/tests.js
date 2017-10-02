const _        = require("underscore");
const async    = require("async");
const jetpack  = require("fs-jetpack");
const test     = require("test");
const {Config} = require("../src/core/config");
const {Locale} = require("../src/core/locale");

// List of test files to run
const TESTS = [
	"event_manager",
	"find_java",
	"launcher_profile_manager",
	"web_services"
];

/**
 * Start the tests
 * @return {Undefined}
 */
function start() {
	jetpack.dir("./test/artifacts");
	var result = {};
	for (var i = 0; i < TESTS.length; i++) {
		_.extend(result, require(`./tests/${TESTS[i]}`));
	}
	test.run(result);
}

// Initialize core modules, and execute the tests
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