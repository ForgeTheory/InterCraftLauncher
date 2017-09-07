const {EventManager} = require("../event_manager");

class Task
{
	/**
	 * Create a new Task instance
	 */
	constructor() { }

	// Overridable methods -----------------------------------------------------

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

	// Methods -----------------------------------------------------------------

	/**
	 * Finish the task
	 * @return {Undefined}
	 */
	finish(nextTask) {
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
