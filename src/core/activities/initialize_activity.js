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
	 * Execute the activity
	 * @return {Undefined}
	 */
	run() {
		this._splash = SplashWindow.create();
		this._splash.on("ready-to-show", () => {
			async.waterfall([
				(cb) => { Config.init(cb); },
				(cb) => { Locale.init(cb); },
				(cb) => { this.displaySplash(cb); }
			], (err) => {
				if (err) {
					console.error("Initialization error:" + err);
					return this.finish();
				}
				setTimeout(() => {
					this.finish();
				}, 3000);
			});
		});
	}

	/**
	 * Display the splash screen with an initial status
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	displaySplash(callback) {
		this._splash.setStatus(Locale.get("splash.status"));
		this._splash.show();
		callback();
	}

	/**
	 * Clean up before activity is destroyed
	 * @return {Undefined}
	 */
	clean() {
		this._splash.close();
		this._splash = null;
	}
}

// Export the module
module.exports = {InitializeActivity};
