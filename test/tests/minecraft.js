const test        = require("test");
const jetpack     = require("fs-jetpack");
const {Locale}    = require("../../src/core/locale");
const {Minecraft} = require("../../src/minecraft/minecraft");

const ARTIFACTS_PATH = jetpack.path("test/artifacts");

let lm = new Minecraft(ARTIFACTS_PATH);

exports["test Minecraft generate launcher_profiles.json"] = function(assert, done) {
	lm.load((err) => {
		assert.equal(err, null, "Launcher profiles were saved successfully");
		done();
	});
};
