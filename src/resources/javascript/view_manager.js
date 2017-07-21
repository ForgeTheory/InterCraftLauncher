var register = undefined;
var unregister = undefined;
var viewport;
var currentView = undefined;

var initViewManager = function() {
	console.log("Initialized");
	viewport = $("#viewport");
	setView('dashboard');
};

var registerView = function() {
	if (typeof register != 'undefined')
		register();
};

var unregisterView = function() {
	if (typeof unregister != 'undefined') {
		console.log("Unregistering the view");
		unregister();
	}
	register = undefined;
	unregister = undefined;
};

var setView = function(view) {
	if (view == currentView)
		return;

	$('.sidenav-item > .active').removeClass('active');
	$(`.sidenav-tab[view='${view}']`).addClass('active');

	currentView = view;
	unregisterView();

	ipcSend('view_load', {
		'key': 'control_panel',
		'view': view
	});
};

var displayView = function(view) {
	$view = $(view).addClass('unloaded');
	$('#viewport').html($view);
	console.log($view);
	registerView();
	$view.each(function(index) {
		var $v = $(this);
		setTimeout(function() {
			console.log("Adding class");
			$v.removeClass('unloaded');
		}, 100*(index+1));
	});
};

ipcReceive('view_result', function(payload) {
	console.log("Got a view");
	if (payload.key == "control_panel")
		if (currentView == payload.view)
			displayView(payload.html);
});