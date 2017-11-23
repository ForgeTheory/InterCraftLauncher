const {EventManager} = require("../../core/event_manager");
const {Window}       = require("./window");

class LauncherWindow extends Window
{
	/**
	 * Create a new LoginWindow instance
	 */
	constructor() {
		super({
			width:     1280,
			height:    720,
			frame:     true,
			minWidth:  992,
			minHeight: 500,
			show:      false
		});
		this.openDevTools();
		this.setView("launcher_main");
	}

	/**
	 * Invoked when the IPC is ready to communicate
	 * @return {Undefined}
	 */
	onIpcReady() {

	}

	/**
	 * Clean up when the window is closing
	 * @return {Undefined}
	 */
	clean() {
	}
}

// Export the module
module.exports = {LauncherWindow};
