const jsonfile     = require("jsonfile");
const test         = require("test");
const {InterCraft} = require("../src/intercraft/intercraft");

// Load the environment
const env = require("./environment");
let token;

exports["test InterCraft status"] = function(assert, done) {
	InterCraft.instance().status((result) => {
		assert.equal(result, true, "InterCraft status success");
		done();
	});
};

exports["test InterCraft login"] = function(assert, done) {
	InterCraft.instance().login(env.email, env.password, (account) => {
		assert.equal(account != null, true, "InterCraft login success");
		token = account._data.token;
		done();
	});
};

exports["test InterCraft set password incorrect password"] = function(assert, done) {
	InterCraft.instance().setPassword("123", env.password, (result) => {
		assert.equal(result, false, "InterCraft failed set password success");
		done();
	});
};

exports["test InterCraft set password"] = function(assert, done) {
	InterCraft.instance().setPassword(env.password, env.password, (result) => {
		assert.equal(result, true, "InterCraft set password success");
		done();
	});
};

exports["test InterCraft logout"] = function(assert, done) {
	InterCraft.instance().logout((result) => {
		assert.equal(result, true, "InterCraft logout success");
		done();
	});
};