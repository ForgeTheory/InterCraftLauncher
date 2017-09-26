const async                    = require("async");
const {Activity}               = require("./activity");
const {Config}                 = require("../config");
const {AuthenticationActivity} = require("./authentication_activity");
const {InterCraft}             = require("../../intercraft/intercraft");
const {LauncherActivity}       = require("./launcher_activity");
const {Locale}                 = require("../locale");
const {SplashWindow}           = require("../../gui/windows/splash_window");


class InitializeActivity extends Activity
{
	/**
	 * Create a new Activity instance
	 */
	constructor() {
		super();
		this._splash        = null;
		this._authenticated = false;
	}

	/**
	 * Execute the activity
	 * @return {Undefined}
	 */
	run() {
		this._splash = new SplashWindow();
		this._splash.on("ready-to-show", () => {
			async.waterfall([
				(cb) => { Config.init(cb); },
				(cb) => { Locale.init(cb); },
				(cb) => { this.displaySplash(cb); },
				(cb) => { this.checkServers(cb); },
				(cb) => { this.authenticate(cb); }
			],
			(err) => { this.onInitFinished(err); });
		});
	}

	/**
	 * Check the InterCraft web services
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	checkServers(callback) {
		this._splash.setStatus("Checking InterCraft services...");
		InterCraft.instance().status((result) => {
			callback(result ? undefined : "offline");
		});
	}

	/**
	 * Authenticate the user
	 * @return {Undefined}
	 */
	authenticate(callback) {
		this._authenticated = false;
		this._splash.setStatus("Checking InterCraft services...");
		callback();
	}

	/**
	 * Display the splash screen with an initial status
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	displaySplash(callback) {
		this._splash.setStatus(Locale.get("splash.status"));
		this._splash.once("show", () => { callback() });
		this._splash.show();
	}

	/**
	 * Executed after all configurations are finished
	 * @return {Undefined}
	 */
	onInitFinished(err) {
		if (err) {
			if (err == "offline") {
				this.finish(new LauncherActivity());
			} else {
				console.error("Initialization error:" + err);
				this.setExitCode(1);
				this.finish();
			}
		} else if (this._authenticated) {
			this.finish(new LauncherActivity());
		} else {
			this.finish(new AuthenticationActivity());
		}
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
