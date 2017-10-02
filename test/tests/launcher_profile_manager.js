const test                     = require("test");
const jetpack                  = require("fs-jetpack");
const {Locale}                 = require("../../src/core/locale");
const {LauncherProfileManager} = require("../../src/minecraft/launcher_profile_manager");

const ARTIFACTS_PATH = jetpack.path("test/artifacts");

let lm = new LauncherProfileManager(ARTIFACTS_PATH);

exports["test Launcher Profile Manager generate"] = function(assert, done) {
	lm.load((err) => {
		assert.equal(err, null, "Launcher profiles were saved successfully");
		done();
	});
};
