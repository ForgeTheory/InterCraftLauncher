
const utils = {

    /**
     * Fetch a parameter from the URL
     * @param  {String} key
     * @return {Undefined}
     */
	urlParam: function(key) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			keyeterName,
			i;
		for (i = 0; i < sURLVariables.length; i++) {
			keyeterName = sURLVariables[i].split('=');

			if (keyeterName[0] === key) {
				return keyeterName[1] === undefined ? true : keyeterName[1];
			}
		}
	},

	/**
	 * Disable transition for the given element
	 * @param  {Jquery Element} elem
	 * @return {Undefined}
	 */
	disableTransitions: function($elem) {
		$elem.addClass("skip-transitions");
	},

	/**
	 * Enable transition for the given element
	 * @param  {Jquery Element} elem
	 * @return {Undefined}
	 */
	enableTransitions: function($elem) {
		$elem.removeClass("skip-transitions");
	}
}

module.exports = utils;