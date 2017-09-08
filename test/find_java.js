const test     = require("test");
const findJava = require("../src/utils/find_java");

exports["test Find Java"] = function(assert, done) {
	findJava((err, result) => {
		assert.equal(err, null, "Java path: " + result);
		done();
	});
};