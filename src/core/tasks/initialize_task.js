const async          = require("async");
const {SplashWindow} = require("../../gui/windows/splash_window");
const {Task}         = require("./task");

class InitializeTask extends Task
{
	/**
	 * Create a new Task instance
	 */
	constructor() {
		super();
		this._splash = null;
	}

	/**
	 * What the task will run
	 * @return {}
	 */
	run() {
		this._splash = SplashWindow.create();
	}

	/**
	 * Clean up before task is destroyed
	 * @return {Undefined}
	 */
	clean() {
		
	}
}

// Export the module
module.exports = {InitializeTask};
