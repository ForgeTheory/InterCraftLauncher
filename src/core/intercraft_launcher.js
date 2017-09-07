const {app}          = require("electron");
const process        = require("process");
const {EventManager} = require('./event_manager');

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
		instance = this;

		this._argv = argv;

		return instance;
	}

	/**
	 * Run the application when ready
	 * @return {Undefined}
	 */
	run() {
		
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

	/**
	 * Exit the application
	 * @param  {Number} exitCode
	 * @return {Undefined}
	 */
	quit(exitCode = 0) {
		app.exit(exitCode);
	}

	// Getters -----------------------------------------------------------------

	/**
	 * Get the command line arguments
	 * @return {Array<String>}
	 */
	argv() { return this._argv; }

	// Events ------------------------------------------------------------------

	/**
	 * Add the event listeners
	 * @return {Undefined}
	 */
	initEvents() {
		EventManager.subscribe("electron-activate",          this.onActivate,      this);
		EventManager.subscribe("electron-before-quit",       this.onBeforeQuit,    this);
		EventManager.subscribe("electron-ready",             this.onReady,         this);
		EventManager.subscribe("electron-will-quit",         this.onQuit,          this);
		EventManager.subscribe("electron-window-all-closed", this.onWindowsClosed, this);
	}
	
	onReady(launchInfo) {
		this.run();
	}
}

// Export the module
module.exports = {InterCraftLauncher};
