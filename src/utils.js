
exports.arrayInsert = function(array, pos, value) {
	array.splice(pos, 0, value);
};

exports.strInsert = function(string, toInsert, pos) {
	return string.slice(0, pos) + toInsert + string.slice(pos, string.length);
};

exports.randomHexString = function(length) {
	var chars = '0123456789abcdef';
	var result = '';
	for (var i = 0; i < length; i++)
		result += chars[Math.floor(Math.random()*16)];
	return result;
};

// Partitions is an array with the length of each group. etc: 1234-45-67-890=[4, 2, 2, 3]
exports.randomHexStringPartitioned = function(partitions) {
	var result = '';
	for (var i = 0; i < partitions.length; i++)
		result += exports.randomHexString(partitions[i]) + '-';
	return result.slice(0, result.length - 1);
};

exports.partitionToken = function(token) {
	return token.slice(0, 8) + '-' +
	       token.slice(8, 12) + '-' +
	       token.slice(12, 16) + '-' +
	       token.slice(16, 20) + '-' +
	       token.slice(20);
};
