const {app}            = require("electron");
const async            = require("async");
const process          = require("process");
const {Config}         = require("./config");
const {EventManager}   = require("./event_manager");
const {InitializeTask} = require("./tasks/initialize_task");
const {Locale}         = require("../locale/locale");
const {TaskManager}    = require("./task_manager");
const {WindowManager}  = require("./window_manager");

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
		this._taskManager   = new TaskManager();
		this._windowManager = new WindowManager();

		return instance = this;
	}

	/**
	 * Once ready, start the first task
	 * @return {Undefined}
	 */
	run(launchInfo) {
		this._launchInfo = launchInfo;
		let initTask = new InitializeTask();
		initTask.start();
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
		EventManager.subscribe("electron-ready",  this.onReady, this);
		EventManager.subscribe("taskmanager-finished", this.quit, this);
	}

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
