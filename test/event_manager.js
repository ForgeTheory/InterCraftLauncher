const test = require("test");

const {EventManager} = require("../src/core/event_manager");

exports["test EventManager subscribe/unsubscribe"] = function(assert) {
	var test1Value = 0;
	var test1 = function(arg1) { test1Value += arg1; };

	EventManager.subscribe("test1", test1, this);
	EventManager.emit("test1", [1]);
	EventManager.emit("test1", [2]);
	EventManager.emit("test1", [3]);
	assert.equal(test1Value, 6, "subscribe success");

	EventManager.unsubscribe("test1", test1);
	EventManager.emit("test1", [4]);
	assert.equal(test1Value, 6, "unsubscribe success");
};

exports["test EventManager one time events"] = function(assert) {
	var test2Value = 0;
	var test2 = function(arg1) { test2Value += arg1; };

	EventManager.listen("test2", test2, this);
	EventManager.emit("test2", [1]);
	EventManager.emit("test2", [2]);
	assert.equal(test2Value, 1, "one time listen success");

	EventManager.listen("test2", test2, this);
	EventManager.unsubscribe("test2", test2);
	EventManager.emit("test2", [4]);
	assert.equal(test2Value, 1, "unsubscribe from one time listen success");
};

exports["test EventManager more arguments"] = function(assert) {
	var test3Value = 0;
	var test3 = function(arg1, arg2, arg3) {
		assert.equal(arg1, 3, "first argument success");
		assert.equal(arg2, 6, "second argument success");
		assert.equal(arg3, 8, "third argument success");
	};

	EventManager.subscribe("test3", test3, this);
	EventManager.emit("test3", [3, 6, 8]);
	EventManager.unsubscribe("test3", test3);
};