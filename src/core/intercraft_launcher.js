const {app}             = require("electron");
const async             = require("async");
const process           = require("process");
const {Config}          = require("./config");
const {EventManager}    = require("./event_manager");
const {InitializeActivity}  = require("./activities/initialize_activity");
const {Locale}          = require("../locale/locale");
const {ActivityManager} = require("./activity_manager");
const {WindowManager}   = require("./window_manager");

// Store the instance globally
let instance = null;

class InterCraftLauncher
{
	/**
	 * Get the current application instance
	 * @return {InterCraft|Null}
	 */
	static instance() { return instance; }

	/**
	 * Create a new InterCraft instance
	 * @return {InterCraft} Return the instance
	 */
	constructor(argv) {
		// Exit if an instance already exists
		if (instance) { return instance; }

		this._argv = argv;
		this._activityManager   = new ActivityManager();
		this._windowManager = new WindowManager();

		return instance = this;
	}

	/**
	 * Add the event listeners
	 * @return {Undefined}
	 */
	initEvents() {
		EventManager.subscribe("electron-ready",  this.onReady, this);
		EventManager.subscribe("activitymanager-finished", this.quit, this);
	}

	/**
	 * Clean the application
	 * @return {Undefined}
	 */
	clean(callback) {
		this._activityManager.clean();
		this._activityManager = null;

		this._windowManager.clean();
		this._windowManager = null;

		if (callback)
			callback();
	}

	/**
	 * Once ready, start the first activity
	 * @return {Undefined}
	 */
	run(launchInfo) {
		this._launchInfo = launchInfo;
		let initActivity = new InitializeActivity();
		initActivity.start();
	}

	// Members -----------------------------------------------------------------

	/**
	 * Get the command line arguments
	 * @return {Array<String>}
	 */
	argv() { return this._argv; }

	// Methods -----------------------------------------------------------------

	/**
	 * Exit the application
	 * @param  {Number} exitCode
	 * @return {Undefined}
	 */
	quit(exitCode = 0) {
		async.parallel([
			(callback) => { this.clean(callback); },
			(callback) => { Config.save(callback); }
		], () => {
			app.exit(exitCode);
			console.log("Exited with code:", exitCode);
		});
	}

	/**
	 * Start the application
	 * @return {Undefined}
	 */
	start() {
		this.initEvents();
		if (app.isReady())
			this.run();
	}

	// Events ------------------------------------------------------------------

	/**
	 * Execute when the Electron app is ready
	 * @param  {} launchInfo
	 * @return {}
	 */
	onReady(launchInfo) {
		this.run(launchInfo);
	}
}

// Export the module
module.exports = {InterCraftLauncher};
