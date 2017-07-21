var register = undefined;
var unregister = undefined;
var viewport;
var currentView = undefined;
var activeTab = undefined;

var viewTabs = {
	"dashboard": $('.sidenav-tab[view="dashboard"]'),
	"news": $('.sidenav-tab[view="news"]'),
	"intercraft_applications": $('.sidenav-dropdown-link[view="intercraft_applications"]'),
	"intercraft_blog": $('.sidenav-dropdown-link[view="intercraft_blog"]'),
	"intercraft_gallery": $('.sidenav-dropdown-link[view="intercraft_gallery"]'),
	"intercraft_members": $('.sidenav-dropdown-link[view="intercraft_members"]'),
	"intercraft_profile": $('.sidenav-dropdown-link[view="intercraft_profile"]'),
	"settings": $('.sidenav-tab[view="settings"]')
}

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
	if (view == currentView || viewTabs[view] == undefined)
		return;

	setTab(view);

	currentView = view;
	unregisterView();

	ipcSend('view_load', {
		'key': 'control_panel',
		'view': view
	});
};

var setTab = function(view) {
	if (viewTabs[view] == undefined)
		return;
	if (activeTab != undefined)
		activeTab.removeClass('active');
	viewTabs[view].addClass('active');

	if (viewTabs[view].hasClass('sidenav-dropdown-link')) {
		// viewTabs[view]
	}
	activeTab = viewTabs[view];
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