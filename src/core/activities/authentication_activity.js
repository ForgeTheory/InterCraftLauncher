const {Activity}    = require("./activity");
const {LoginWindow} = require("../../gui/windows/login_window");


class AuthenticationActivity extends Activity
{
	/**
	 * Create an AuthenticationActivity instance
	 */
	constructor() {
		super();
	}

	/**
	 * Execute the activity when ready
	 * @return {Undefined}
	 */
	run() {
		console.log("Running auth activity");
		this.init();
	}

	/**
	 * Initialize everything
	 * @return {Undefined}
	 */
	init() {
		let win = this._loginWindow = new LoginWindow();
		win.on("ready-to-show", () => { this._loginWindow.show(); });
		win.on("close",         () => { this.onWindowClosed(); });
	}

	/**
	 * Executed when the login window is closed
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
		// this._loginWindow.exit();
		this._loginWindow = null;
	}
}

// Export the module
module.exports = {AuthenticationActivity}
