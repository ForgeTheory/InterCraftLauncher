const async                    = require("async");
const {Activity}               = require("./activity");
const {Config}                 = require("../core/config");
const {AuthenticationActivity} = require("./authentication_activity");
const {InterCraft}             = require("../intercraft/intercraft");
const {LauncherActivity}       = require("./launcher_activity");
const {Locale}                 = require("../core/locale");
const {SplashWindow}           = require("../gui/windows/splash_window");


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
		this._splash = new SplashWindow();
		this._splash.on("ready-to-show", () => {
			async.waterfall([
				(cb) => { Config.init(cb); },
				(cb) => { Locale.init(cb); },
				(cb) => { this.displaySplash(cb); },
				(cb) => { this.loadAccount(cb) },
				(cb) => { this.checkServers(cb); },
				(cb) => { this.authenticate(cb); }
			],
			(err) => { this.onInitFinished(err); });
		});
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
	 * Load the stored InterCraft account
	 * @return {callback}
	 */
	loadAccount(callback) {
		console.log("Loading account");
		this._splash.setStatus(Locale.get("splash.loading_intercraft"));
		InterCraft.instance().load(callback);
	}

	/**
	 * Check the InterCraft web services
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	checkServers(callback) {
		console.log("Checking servers...");
		this._splash.setStatus(Locale.get("splash.check_intercraft_services"));
		InterCraft.instance().status((err) => {
			callback(err ? "offline" : undefined);
		});
	}

	/**
	 * Authenticate the user
	 * @return {Undefined}
	 */
	authenticate(callback) {
		console.log("Authenticating session...");
		this._splash.setStatus(Locale.get("splash.authenticating"));
		InterCraft.instance().authenticate((err) => {
			callback(err ? "invalid_auth_token" : undefined);
		});
	}

	/**
	 * Executed after all configurations are finished
	 * @return {Undefined}
	 */
	onInitFinished(err) {
		if (err) {
			if (err == "offline") {
				console.log("Loading in offline mode");
				this.finish(new LauncherActivity());
			} else if (err == "invalid_auth_token") {
				console.log("Authenticating...");
				this.finish(new AuthenticationActivity);
			} else {
				console.error("Initialization error:" + err);
				this.setExitCode(1);
				this.finish();
			}
		} else {
			this.finish(new LauncherActivity());
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
