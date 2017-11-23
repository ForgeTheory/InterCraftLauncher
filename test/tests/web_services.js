const test         = require("test");
const {InterCraft} = require("../../src/intercraft/intercraft");

// Load the environment
const env = require("../environment");

exports["test InterCraft status"] = function(assert, done) {
	InterCraft.instance().status((err) => {
		assert.equal(err, false, "InterCraft status success");
		done();
	});
};

exports["test InterCraft login"] = function(assert, done) {
	InterCraft.instance().login(env.intercraft_email, env.intercraft_password, true, (err) => {
		assert.equal(err, false, "InterCraft login success");
		done();
	});
};

exports["test InterCraft authenticate token"] = function(assert, done) {
	InterCraft.instance().authenticate((err) => {
		assert.equal(err, false, "InterCraft authenticate token success");
		done();
	});
};

exports["test InterCraft set password incorrect password"] = function(assert, done) {
	InterCraft.instance().setPassword("123", env.intercraft_password, (err) => {
		assert.equal(err, true, "InterCraft failed set password success");
		done();
	});
};

exports["test InterCraft set password"] = function(assert, done) {
	InterCraft.instance().setPassword(env.intercraft_password, env.intercraft_password, (err) => {
		assert.equal(err, false, "InterCraft set password success");
		done();
	});
};

exports["test InterCraft logout"] = function(assert, done) {
	InterCraft.instance().logout((err) => {
		assert.equal(err, false, "InterCraft logout success");
		done();
	});
};