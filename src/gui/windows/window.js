const {BrowserWindow} = require("electron");

class Window
{
	/**
	 * Create a window
	 * @param {Json} options
	 */
	constructor(options) {
		this._options = options;
		this._window = new BrowserWindow(options);

		this.initEvents();
	}

	/**
	 * Initialize the event listeners
	 * @return {Undefined}
	 */
	initEvents() {
		var on = (event, callback) => {
			this._window.on(event, (...args) => { callback(...args); });
		};
		on("close",              this.onClose);
		on("move",               this.onMove);
		on("moved",              this.onMove);
		on("page-title-updated", this.onPageTitleUpdate);
		on("resize",             this.onResize);
		on("ready-to-show",      this.onReadyToShow);
		on("blur",               this.onBlur);
		on("focus",              this.onFocus);
		on("minimize",           this.onMinimize);
		on("restore",            this.onRestore);
		on("maximize",           this.onMaximize);
		on("unmaximize",         this.onUnmaximize);
		on("hide",               this.hide);
		on("show",               this.show);
		on("enter-full-screen",  this.onEnterFullScreen);
		on("leave-full-screen",  this.onLeaveFullScreen);
	}

	// Overridable Events ------------------------------------------------------

	/**
	 * Executed when the window loses focus
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onBlur(event) { }

	/**
	 * Executed when attempting to close the window
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onClose(event) { }

	/**
	 * Executed when the window enters full-screen
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onEnterFullScreen(event) { }

	/**
	 * Executed when the window gains focus
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onFocus(event) { }

	/**
	 * Executed when the window is hidden
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onHide(event) { }

	/**
	 * Executed when the window leaves full-screen
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onLeaveFullScreen(event) { }

	/**
	 * Executed when the window is maximized
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onMaximize(event) { }

	/**
	 * Executed when the window is minimized
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onMinimize(event) { }

	/**
	 * Executed when the window is moved
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onMove(event) { }

	/**
	 * Executed when the webpage title updates
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onPageTitleUpdate(event, title) { this._window.setTitle(title); }

	/**
	 * Executed when the window is ready to be displayed
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onReadyToShow(event) { }

	/**
	 * Executed when the window is resized
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onResize(event) { }

	/**
	 * Executed when the window is restored from a minimized state
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onRestore(event) { }

	/**
	 * Executed when the window is shown
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onShow(event) { }

	/**
	 * Executed when the window exits a maximized state
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	onUnmaximize(event) { }
};

// Export the module
module.exports = {Window};
