const {EventManager} = require("../core/event_manager");

class Activity
{
	/**
	 * Create a new Activity instance
	 */
	constructor() {
		this._exitCode = 0;
		this._started  = false;
		this._finished = false;
	}

	// Overridable Methods -----------------------------------------------------

	/**
	 * What the activity will run
	 * @return {}
	 */
	run() {}

	/**
	 * Clean up before activity is destroyed
	 * @return {Undefined}
	 */
	clean() {}

	// Accessors and Mutators --------------------------------------------------

	/**
	 * Get the exit code of the activity
	 * @return {Integer}
	 */
	exitCode() { return this._exitCode; }

	/**
	 * Check if the activity is finished
	 * @return {[type]} [description]
	 */
	isFinished() { return this._finished; }

	/**
	 * Check if the activity has started
	 * @return {Boolean}
	 */
	isStarted() { return this._started; }

	/**
	 * Set exit code for the application
	 * @return {Undefined}
	 */
	setExitCode(exitCode) { this._exitCode = exitCode; }

	// Methods -----------------------------------------------------------------

	/**
	 * Finish the activity
	 * @return {Undefined}
	 */
	finish(nextActivity) {
		if (!this._finished) {
			this._finished = true;
			EventManager.emit("activity-finished", [this, nextActivity]);
		}
	}

	/**
	 * Start the activity
	 * @return {}
	 */
	start() {
		if (!this._started) {
			this._started = true;
			EventManager.emit("activity-started", [this]);
		}
	}
}

// Export the module
module.exports = {Activity};
