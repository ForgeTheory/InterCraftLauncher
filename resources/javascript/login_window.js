const ipc   = require("./ipc");
const utils = require("./utils");

const loginWindow = {

	/**
	 * Initialize the login window
	 * @return {Undefined}
	 */
	init: function() {
		ipc.subscribe("set_email", loginWindow.setEmail);
		ipc.subscribe("login_result", loginWindow.loginResult);
		$("#login-form").submit(loginWindow.login);
	},

	/**
	 * Submit the login information
	 * @param  {Event} event
	 * @return {Undefined}
	 */
	login: function(event) {
		event.preventDefault();
		var email    = $("#email").prop("disabled", true).val();
		var password = $("#password").prop("disabled", true).val();
		var remember = $("#remember").prop("disabled", true).is(":checked");
		$("#login-submit").prop("disabled", true);
		ipc.send("login", {
			email:    email,
			password: password,
			remember: remember
		});
	},

	/**
	 * Executed when a login result has been received
	 * @param  {Something} result
	 * @return {Undefined}
	 */
	loginResult: function(result) {
		if (!result) {
			$("#email").prop("disabled", false);
			$("#password").prop("disabled", false);
			$("#remember").prop("disabled", false);
			$("#login-submit").prop("disabled", false);
			$(".md-form").addClass("has-danger");
		}
	},

	/**
	 * Set the email field
	 * @param {String|Null} email
	 */
	setEmail: function(email) {
		if (email) {
			var $label = $("label[for=\"email\"");
			utils.disableTransitions($label);
			$label.addClass("active");
			$("#email").val(email);
			setTimeout(() => { utils.enableTransitions($label);	}, 0);
			$("#password").focus();
		} else {
			$("#email").focus();
			setTimeout(() => {
				$("label[for=\"email\"").addClass("active");
			}, 0);
		}
	}
}

// Export the module
module.exports = loginWindow;
