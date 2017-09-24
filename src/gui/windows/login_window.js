const {EventManager} = require("../../core/event_manager");
const {Window}       = require("./window");

class LoginWindow extends Window
{
	/**
	 * Create a new LoginWindow instance
	 */
	constructor() {
		super({
			width:     400,
			height:    460,
			frame:     true,
			resizable: false,
			show:      false
		});
		this.openDevTools();
		this.setView("login");
	}

	/**
	 * Clean up when the window is closing
	 * @return {Undefined}
	 */
	clean() {
	}
}

// Export the module
module.exports = {LoginWindow};
