
var intercraftStats = undefined;
var intercraftStatsUpdateInterval = undefined
var intercraftStatsUpdateIntervalDelay = 10000 // 10 seconds
var intercraftStatsListeners = [];

updateInterCraftStats = function() {
	console.log("Updating stats...");
	$.get('https://intercraftmc.com/launcher/stats', {}, function(result) {
		intercraftStats = result;
		for (var i = 0; i < intercraftStatsListeners.length; i++)
			intercraftStatsListeners[i](intercraftStats);
	});
};

var addOnInterCraftStatsUpdateListener = function(callback) {
	if (intercraftStatsListeners.indexOf(callback) == -1) {
		console.log("Callback added");
		intercraftStatsListeners.push(callback);
	}
	else
		console.warn("Attempted to register an already registered callback", callback)
};

var removeOnInterCraftStatsUpdateListener = function(callback) {
	var index = intercraftStatsListeners.indexOf(callback)
	if (index != -1)
		intercraftStatsListeners.splice(index, 1);
	else
		console.warn("Attempted to unregister a non-existant callback", callback)
};

intercraftStatsUpdateInterval = setInterval(updateInterCraftStats, intercraftStatsUpdateIntervalDelay);