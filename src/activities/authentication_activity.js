const {Activity}         = require("./activity");
const {InterCraft}       = require("../intercraft/intercraft");
const {LauncherActivity} = require("./launcher_activity");
const {LoginWindow}      = require("../gui/windows/login_window");


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
		let win = this._loginWindow = new LoginWindow();
		win.on("ready-to-show", () => { this._loginWindow.show(); });
		win.on("close",         () => { this.onWindowClosed(); });
		win.subscribe("login", this.onLogin, this);
		win.setEmail(InterCraft.instance().account().email());
	}

	/**
	 * Executed when a login attempt has been made
	 * @param  {Json Object} credentials
	 * @return {Undefined}
	 */
	onLogin(credentials) {
		console.log(credentials);
		InterCraft.instance().login(
			credentials.email,
			credentials.password,
			credentials.remember,
			(err) => {
				if (err)
					this._loginWindow.send("login_result", false);
				else
					this.finish(new LauncherActivity());
			}
		);
	}

	/**
	 * Executed when the login window is closed
	 * @return {Undefined}
	 */
	onWindowClosed() { this.finish(); }

	/**
	 * Clean the activity
	 * @return {Undefined}
	 */
	clean() {
		this._loginWindow.close();
		this._loginWindow = null;
	}
}

// Export the module
module.exports = {AuthenticationActivity}
