const {app} = require("electron");

let instance;

class EventManager
{
	/**
	 * Subscribe to an event
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @param  {Context}  context
	 * @return {Undefined}
	 */
	static subscribe(event, callback, context = undefined) {
		EventManager.instance().addListener(event, callback, context);
	}

	/**
	 * Unsubscribe from an event
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static unsubscribe(event, callback) {
		EventManager.instance().removeListener(event, callback);
	}

	/**
	 * Listen for an event once
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @param  {Context}  context
	 * @return {Undefined}
	 */
	static listen(event, callback, context = undefined) {
		EventManager.instance().addOneTimeListener(event, callback, context);
	}

	/**
	 * Broadcast an event
	 * @param  {String}   event
	 * @param  {Array}    args
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	static emit(event, args, callback) {
		EventManager.instance().broadcast(event, args, callback);
	}

	/**
	 * Get the current EventManager instance
	 * @return {EventManager}
	 */
	static instance() {
		if (!instance)
			instance = new EventManager();
		return instance;
	}

	/**
	 * EventManager constructor
	 */
	constructor() {
		this._listeners = {}
	}

	/**
	 * Add an event listener
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @param  {Context}   context
	 * @return {Undefined}
	 */
	addListener(event, callback, context) {
		if (this._listeners[event] == undefined) {
			if (event.startsWith("electron-")) {
				app.on(
					event.slice('electron-'.length),
					() => { this.broadcast(event, arguments) }
				);
			}
			this._listeners[event] = [];
		}
		this._listeners[event].push([callback, context]);
	}

	/**
	 * Add a one-time event listener
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @param  {Context}   context
	 * @return {Undefined}
	 */
	addOneTimeListener(event, callback, context) {

	}

	/**
	 * Remove an event listener
	 * @param  {String}   event
	 * @param  {Function} callback
	 * @param  {Context}   context
	 * @return {Undefined}
	 */
	removeListener(event, callback) {
		if (this._listeners[event] == undefined)
			return;
	}

	/**
	 * Broadcast an event
	 * @param  {String}   event
	 * @param  {Array}    args
	 * @param  {Function} callback
	 * @return {Undefined}
	 */
	broadcast(event, args, callback) {
		if (this._listeners[event] == undefined)
			return;
			
		for (var i = 0; i < this._listeners[event].length; i++) {
			let method  = this._listeners[event][i][0];
			let context = this._listeners[event][i][1];
			method.apply(context, args);
		}

		if (callback)
			callback(event, args);
	}
}

// Export the module
module.exports = {EventManager}
