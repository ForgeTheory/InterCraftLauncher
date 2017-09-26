const test = require("test");

var tests = [
	require('./event_manager'),
	require('./find_java'),
	require('./web_services')
];

var result = {};
for (t in tests) {
	for (k in tests[t]) {
		result[k] = tests[t][k];
	}
}

test.run(result);