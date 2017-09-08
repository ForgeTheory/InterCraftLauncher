const {EventManager} = require("../event_manager");

class Task
{
	/**
	 * Create a new Task instance
	 */
	constructor() { this._exitCode = 0;	}

	// Overridable Methods -----------------------------------------------------

	/**
	 * What the task will run
	 * @return {}
	 */
	run() {}

	/**
	 * Clean up before task is destroyed
	 * @return {Undefined}
	 */
	clean() {}

	// Members -----------------------------------------------------------------

	/**
	 * Get the exit code of the task
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
	 * Finish the task
	 * @return {Undefined}
	 */
	finish(nextTask) {
		console.log("Finishing task");
		EventManager.emit("task-finished", [this, nextTask]);
	}

	/**
	 * Start the task
	 * @return {}
	 */
	start() {
		EventManager.emit("task-started", [this]);
	}
}

// Export the module
module.exports = {Task};
