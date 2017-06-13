var content;

init = function() {
	content = $("#content");
};

$(document).ready(function() {
	init();
	
	$('.sidenav-tab').click(function(e) {
		$('.sidenav-item > .active').removeClass('active');
		$(e.target).addClass('active');
	});

	$('.sidenav-dropdown-tab').click(function(e) {
		var hasClass = $(e.target).hasClass('toggled')
		console.log("Clicked", e);
		$('.sidenav-item .toggled').removeClass('toggled');
		if (!hasClass) {
			console.log("Adding the toggled class");
			$(e.target).addClass('toggled');
		}
	});
});