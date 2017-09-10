const {EventManager} = require("../../core/event_manager");
const {Window}       = require("./window");

class SplashWindow extends Window
{
	/**
	 * Create a new splash window instance
	 */
	constructor() {
		super({
			width: 341,
			height: 421,
			frame: false,
			transparent: true,
			resizable: false,
			movable: false,
			minimizable: false,
			show: false
		});
		this.setView("splash");
		EventManager.subscribe("splash-status-msg", this.setStatus, this);
	}

	/**
	 * Clean up when the splash is closing
	 * @return {Undefined}
	 */
	clean() {
		EventManager.unsubscribe("splash-status-msg", this.setStatus);
	}

	/**
	 * Set the status message of the splash
	 * @param {String} message
	 * @return {Undefined}
	 */
	setStatus(message) {
		this.send("splash-status-msg", message);
	}
}

// Export the module
module.exports = {SplashWindow};
