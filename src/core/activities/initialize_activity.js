const async          = require("async");
const {Activity}     = require("./activity");
const {Config}       = require("../config");
const {Locale}       = require("../../locale/locale");
const {SplashWindow} = require("../../gui/windows/splash_window");

class InitializeActivity extends Activity
{
	/**
	 * Create a new Activity instance
	 */
	constructor() {
		super();
		this._splash = null;
	}

	/**
	 * What the activity will run
	 * @return {}
	 */
	run() {
		this._splash = SplashWindow.create();
		async.waterfall([
			(cb) => { Config.init(cb); },
			(cb) => { Locale.init(cb); }
		], (err) => {
			if (err)
				console.log("Initialization error:" + err);
			this.finish();
		});
	}

	/**
	 * Clean up before activity is destroyed
	 * @return {Undefined}
	 */
	clean() {
		
	}
}

// Export the module
module.exports = {InitializeActivity};
