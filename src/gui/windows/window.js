const {BrowserWindow} = require("electron");

class Window extends BrowserWindow
{
	/**
	 * Create a window
	 * @param {Json} options
	 */
	constructor(options) {
		super(options);
		this.setMenu(null);
		this.initEvents();
	}

	/**
	 * Initialize the event listeners
	 * @return {Undefined}
	 */
	initEvents() {
		this.on("close",              this.onClose);
		this.on("move",               this.onMove);
		this.on("moved",              this.onMove);
		this.on("page-title-updated", this.onPageTitleUpdate);
		this.on("resize",             this.onResize);
		this.on("ready-to-show",      this.onReadyToShow);
		this.on("blur",               this.onBlur);
		this.on("focus",              this.onFocus);
		this.on("minimize",           this.onMinimize);
		this.on("restore",            this.onRestore);
		this.on("maximize",           this.onMaximize);
		this.on("unmaximize",         this.onUnmaximize);
		this.on("hide",               this.onHide);
		this.on("show",               this.onShow);
		this.on("enter-full-screen",  this.onEnterFullScreen);
		this.on("leave-full-screen",  this.onLeaveFullScreen);
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Add an event listener
	 * @param  {String}   event   
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	on(event, callback) {
		super.on(event, (...args) => { callback(...args); });
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
