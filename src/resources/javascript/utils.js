
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
	}
}

module.exports = utils;