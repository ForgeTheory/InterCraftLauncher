const _        = require("underscore");
const async    = require("async");
const jetpack  = require("fs-jetpack");
const test     = require("test");
const {Config} = require("../src/core/config");
const {Locale} = require("../src/core/locale");

/**
 * Start the tests
 * @return {Undefined}
 */
function start() {
	var tests = jetpack.list("./test/tests");
	console.log(tests);
	var result = {};
	for (var i = 0; i < tests.length; i++) {
		_.extend(result, require(`./tests/${tests[i]}`));
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