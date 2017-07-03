var download = require('download-file');
var path = require('path');

/**
 * Download a given list of files formatted as: {'url': 'save-location'}
 * @param  {Json Object}   files
 * @param  {Function}      callback
 * @return {Undefined}
 */
exports.downloadList = function(files, callback) {
	var nextFile = (files) => {
		var urls = Object.keys(files);

		if (urls.length == 0)
			return callback(true);

		var url = urls[0];
		var options = {
			directory: path.dirname(files[url]),
			filename: path.basename(files[url])
		}

		download(url, options, (err) => {
			if (err !== false)
				return callback(false);
			delete files[url];
			nextFile(files);
		});
	};
	nextFile(files);
};

exports.download = function(url, location, callback) {
	var options = {
		directory: path.dirname(location),
		filename: path.basename(location)
	}
	download(url, options, (err) => {
		if (err !== false)
			return callback(false);
		callback(true);
	});
};