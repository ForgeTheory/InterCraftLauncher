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
		console.log("The initialization task is running");
		this._splash = SplashWindow.create();

		setTimeout(() => {
			this._splash.close();
			this.finish();
		}, 2000);
	}

	/**
	 * Clean up before task is destroyed
	 * @return {Undefined}
	 */
	clean() {
		this._splash = null;
	}
}

// Export the module
module.exports = {InitializeTask};
