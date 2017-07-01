
/**
 * Get the operating system
 * @return {String}
 */
exports.os = function() {
	if (process.platform == 'win32')
		return 'windows';
	else if (process.platform == 'darwin')
		return 'osx';
	return 'linux';
};

/**
 * Insert an element into an array
 * @param  {Array}    array
 * @param  {Integer}  pos
 * @param  {Anything} value
 * @return {Undefined}
 */
exports.arrayInsert = function(array, pos, value) {
	array.splice(pos, 0, value);
};

/**
 * Remove an element from an array at the given index
 * @param  {Array}   array
 * @param  {Integer} index
 * @return {Array}
 */
exports.arrayRemove = function(array, index) {
	return array.slice(0, index).concat(array.slice(index+1));
};

/**
 * Insert a string into another string at the given position
 * @param  {String}  string
 * @param  {String}  toInsert
 * @param  {Integer} pos
 * @return {String}
 */
exports.strInsert = function(string, toInsert, pos) {
	return string.slice(0, pos) + toInsert + string.slice(pos, string.length);
};

/**
 * Generate a random hexadecimal string
 * @param  {Integer} length
 * @return {String}
 */
exports.randomHexString = function(length) {
	var chars = '0123456789abcdef';
	var result = '';
	for (var i = 0; i < length; i++)
		result += chars[Math.floor(Math.random()*16)];
	return result;
};

/**
 * Generate a partitioned hexadecimal string, inserting separators at the marked positions
 * Example: '1234-45-67-890', partitions=[4, 2, 2, 3]
 * @param  {Array} partitions
 * @return {String}
 */
exports.randomHexStringPartitioned = function(partitions) {
	var result = '';
	for (var i = 0; i < partitions.length; i++)
		result += exports.randomHexString(partitions[i]) + '-';
	return result.slice(0, result.length - 1);
};
