const downloadFile = require("download-file");
const got          = require("got");

class NetworkManager
{
	// REST Api ----------------------------------------------------------------
	
	/**
	 * REST Api GET request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static get(url, data, options, callback) {
		this.request(url, "GET", data, options, callback);
	}

	/**
	 * REST Api POST request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static post(url, data, options, callback) {
		this.request(url, "POST", data, options, callback);
	}

	/**
	 * REST Api PUT request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static put(url, data, options, callback) {
		this.request(url, "PUT", data, options, callback);
	}

	/**
	 * REST Api PATCH request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static patch(url, data, options, callback) {
		this.request(url, "PATCH", data, options, callback);
	}

	/**
	 * REST Api DELETE request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static delete(url, data, options, callback) {
		this.request(url, "DELETE", data, options, callback);
	}

	// Raw Methods -------------------------------------------------------------

	/**
	 * Make an HTTP/HTTPS request
	 * @param  {String}           url
	 * @param  {String}           method
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static request(url, method, data, options, callback) {
		if (typeof options == "function") {
			callback = options;
			options = {};
		} else
			options = options || {}

		if (typeof data == "function") {
			callback = data;
			options.data = null;
		} else
			options.data = data
		options.method = method;

		got(url, options)
		    .then(response => { callback(response); })
		    .catch(err     => { callback(err); });
	}

	// Other Network Utilities -------------------------------------------------

	/**
	 * REST Api GET request
	 * @param  {String}           url
	 * @param  {Json Object|Null} data
	 * @param  {Json Object|Null} options
	 * @param  {Function}         callback
	 * @return {Undefined}
	 */
	static download(url, options, callback) {
		downloadFile(url, options, callback);
	}
}

// Export the module
module.exports = {NetworkManager};
