const {ipcReceive, ipcReceiveOnce, ipcSend} = require('electron-simple-ipc');

const ipc = {
	/**
	 * Receive a message over IPC
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	receive: function (key, callback) { ipcReceiveOnce(key, callback); },

	/**
	 * Send a message over IPC
	 * @param  {String}   key
	 * @param  {Anything} content
	 * @return {Undefined}
	 */
	send: function (key, content) { ipcSend(key, content); },

	/**
	 * Receive a message over IPC
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	subscribe: function (key, callback) { ipcReceive(key, callback); },

	/**
	 * Let the main process window know that we're ready to receive events
	 * @return {Undefined}
	 */
	ready: function() { ipcSend("__ipc_ready", true); }
}

// Export the module
module.exports = ipc;