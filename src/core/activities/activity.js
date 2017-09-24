const {EventManager} = require("../event_manager");

class Activity
{
	/**
	 * Create a new Activity instance
	 */
	constructor() { this._exitCode = 0;	}

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

	// Members -----------------------------------------------------------------

	/**
	 * Get the exit code of the activity
	 * @return {Integer}
	 */
	exitCode() {
		return this._exitCode;
	}

	/**
	 * Set exit code for the application
	 * @return {Undefined}
	 */
	setExitCode(exitCode) {
		this._exitCode = exitCode;
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Finish the activity
	 * @return {Undefined}
	 */
	finish(nextActivity) {
		EventManager.emit("activity-finished", [this, nextActivity]);
	}

	/**
	 * Start the activity
	 * @return {}
	 */
	start() {
		EventManager.emit("activity-started", [this]);
	}
}

// Export the module
module.exports = {Activity};
