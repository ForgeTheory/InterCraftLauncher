const ejse            = require("ejs-electron");
const {BrowserWindow} = require("electron");
const ipc             = require("electron-simple-ipc");
const path            = require("path");
const {URL}           = require("url");
const {EventManager}  = require("../../core/event_manager");
const {Locale}        = require("../../locale/locale");

const TEMPLATES_PATH = "../../resources/views";

class Window extends BrowserWindow
{
	/**
	 * Create a window
	 * @param {Json} options
	 */
	constructor(options) {
		super(options);
		this._forceClose = false;
		this.setMenu(null);
		this.initEvents();
		EventManager.emit("window-created", [this]);
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

	// Overridable Methods -----------------------------------------------------

	/**
	 * Executed after the window has closed right before it's destroyed
	 * @return {Undefined}
	 */
	clean() { }

	// IPC Methods -------------------------------------------------------------

	/**
	 * Start listening for an IPC event
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	subscribe(key, callback) {
		ipc.ipcReceive(key, (...args) => { callback(...args); });
	}

	/**
	 * Listen once for an IPC event
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	receive(key, callback) {
		ipc.ipcReceiveOnce(key, (...args) => { callback(...args); });
	}

	/**
	 * Send a message to the view
	 * @return {Undefined}
	 */
	send(key, message) {
		ipc.ipcSend(key, message);
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Force close the window, ignoring all overrides
	 * @return {Undefined}
	 */
	forceClose() {
		this._forceClose = true;
		this.close();
	}

	/**
	 * Add an event listener
	 * @param  {String}   event   
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	on(event, callback) {
		super.on(event, (...args) => { callback.apply(this, args); });
	}

	/**
	 * Set the view of the window
	 * @param  {String}      view
	 * @param  {Json Object} data
	 * @param  {Json Object} options
	 * @return {Undefined}
	 */
	setView(view, data = {}, options = {}) {
		var urlObj = new URL("file://" + path.join(__dirname, `${TEMPLATES_PATH}/${view}.ejs`));
		urlObj.slashes = true;
		urlObj.searchParams.append("locale", JSON.stringify(Locale.get()));

		data.locale = Locale.get()
		ejse.data(data).options(data);
		
		this.loadURL(urlObj.href);
	}

	// Overridable Event Methods -----------------------------------------------

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
	onClose(event) {
		if (!event.defaultPrevented || this._forceClose) {
			this.clean();
			EventManager.emit("window-closed", this);
		}
	}

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
	onPageTitleUpdate(event, title) { this.setTitle(title); }

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
