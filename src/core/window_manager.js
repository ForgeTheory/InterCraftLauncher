const {EventManager} = require("./event_manager");

let instance = null;

class WindowManager
{
	/**
	 * Get the current instance of the WindowManager
	 * @return {WindowManager|Null}
	 */
	static instance() { return instance; }

	/**
	 * Create a new instance of the WindowManager
	 * @return {WindowManager}
	 */
	constructor() {
		// Exit if an instance already exists
		if (instance) { return instance; }
		this._windows = [];
		EventManager.subscribe("window-created", this.onWindowCreated, this);
		EventManager.subscribe("window-closed",  this.onWindowClosed,  this);
		return instance = this;
	}

	/**
	 * Executed when a new window has been created
	 * @return {Undefined}
	 */
	onWindowCreated(win) {
		this._windows.push(win);
	}

	/**
	 * Executed when a window has been closed
	 * @return {Undefined}
	 */
	onWindowClosed(win) {
		this._windows.splice(this._windows.indexOf(win), 1);
	}
}

// Export the module
module.exports = {WindowManager};
