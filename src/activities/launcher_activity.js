const {Activity} = require("./activity");


class LauncherActivity extends Activity
{
	/**
	 * Create an LauncherActivity instance
	 */
	constructor() {
		super();
	}

	/**
	 * Execute the activity when ready
	 * @return {Undefined}
	 */
	run() {
		console.log("Launcher activity");
		this.finish();
	}

	/**
	 * Clean the activity
	 * @return {Undefined}
	 */
	clean() {

	}
}

// Export the module
module.exports = {LauncherActivity}
