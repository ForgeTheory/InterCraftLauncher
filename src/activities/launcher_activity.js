const {Activity}       = require("./activity");
const {LauncherWindow} = require("../gui/windows/launcher_window");


class LauncherActivity extends Activity
{
	/**
	 * Create an LauncherActivity instance
	 */
	constructor() {
		super();
		this._launcherWindow = null;
	}

	/**
	 * Execute the activity when ready
	 * @return {Undefined}
	 */
	run() {
		console.log("Launcher activity");
		let win = this._launcherWindow = new LauncherWindow();
		win.on("ready-to-show", () => { this._launcherWindow.show(); });
		win.on("close",         () => { this.onWindowClosed(); });
	}

	/**
	 * Executed when the launcher window closed
	 * @return {Undefined}
	 */
	onWindowClosed() {
		this.finish();
	}

	/**
	 * Clean the activity
	 * @return {Undefined}
	 */
	clean() {
		this._launcherWindow = null;
	}
}

// Export the module
module.exports = {LauncherActivity}
