const {BrowserWindow} = require('electron');
const {ipcSend, ipcReceive} = require('electron-simple-ipc');
const path = require('path');
const url = require('url');

const TEMPLATES_PATH = '../views';

class Window {
	constructor(options) {
		this._readyToShow = true;
		this._showWhenReady = false;
		this._options = this.parseOptions(options);
		this._window = new BrowserWindow(this._options);
		this._window.setMenu(null);

		this.initEvents();
	}

	/**
	 * Parse the given options
	 * @param  {Json Object} options
	 * @return {Json Object}
	 */
	parseOptions(options) {
		if (options.toolBar == undefined)
			options.toolBar = false;
		if (options.show == undefined)
			options.show = false;
		return options;
	}

	/**
	 * Initialize the events and listeners
	 * @return {Undefined}
	 */
	initEvents() {
		this.on('ready-to-show', () => { this.onReadyToShow(); });
		this.on('closed', (event) => { this.onClose(); })
	}

	/**
	 * Execute when the window is closing
	 * @return {[type]} [description]
	 */
	onClose(event) {
		this._closed = true;
		this._window = null;
	}

	/**
	 * Execute when the window is ready to show
	 * @return {Undefined}
	 */
	onReadyToShow() {
		console.log("Ready to show...", this._showWhenReady);
		this._readyToShow = true;
		if (this._showWhenReady)
			this.show();
		this._showWhenReady = false;
	}

	/**
	 * On the given event, invoke the given callback
	 * @param  {String}   event
	 * @param  {Function} callback
	 */
	on(event, callback) {
		this._window.on(event, callback);
		return this;
	}

	/**
	 * Listen for an IPC event
	 * @param  {String}   event
	 * @param  {Function} callback
	 */
	listen(event, callback) {
		ipcReceive(event, callback);
		return this;
	}

	/**
	 * Send an IPC event
	 * @param {String} event
	 * @param {Json Array} payload
	 */
	send(event, payload) {
		ipcSend(event, payload);
		return this;
	}

	/**
	 * Add an event listener for the given event for one invokation
	 * @param  {String}   event
	 * @param  {Function} callback
	 */
	once(event, callback) {
		this._window.once(event, callback);
		return this;
	}

	/**
	 * Get the BrowserWindow
	 * @return {BrowserWindow}
	 */
	window() {
		return this._window;
	}

	/**
	 * Get the name of the window
	 * @return {String}
	 */
	name() {
		return this._name;
	}

	/**
	 * Set the name of the window
	 */
	setName(name) {
		this._name = name;
		return this;
	}

	/**
	 * Get the current view
	 * @return {String}
	 */
	view() {
		return this._view;
	}

	/**
	 * Set the current view
	 * @param {String} view
	 */
	setView(view) {
		this._readyToShow = false;
		this._window.loadURL(url.format({
			pathname: path.join(__dirname, `${TEMPLATES_PATH}/${view}.htm`),
			protocol: 'file:',
			slashes: true
		}));
	}

	/**
	 * Close the window
	 * @return {Undefined}
	 */
	close() {
		console.log("Closing window");
		if (!this._closed) {
			this._closed = true;
			if (this._window)
				this._window.close();
			this._window = null;
		}
	}
	
	/**
	 * Remove the window handle
	 * @return {Undefined}
	 */
	nullify() {
		this._closed = true;
		this._window = null;
	}

	/**
	 * Show the window
	 */
	show() {
		if (!this._window.isVisible())
			this._window.show();
		return this;
	}

	/**
	 * Show the window when the view has fully loaded
	 */
	showWhenReady() {
		console.log("Showing when ready...");
		if (this._window.isVisible())
			return this;
		if (this._readyToShow)
			return this.show();
		this._showWhenReady = true;
		return this;
	}
}

exports.Window = Window;