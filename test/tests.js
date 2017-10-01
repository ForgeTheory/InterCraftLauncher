const test = require("test");

var tests = [
	require('./tests/event_manager'),
	require('./tests/find_java'),
	require('./tests/web_services')
];

var result = {};
for (t in tests) {
	for (k in tests[t]) {
		result[k] = tests[t][k];
	}
}

test.run(result);