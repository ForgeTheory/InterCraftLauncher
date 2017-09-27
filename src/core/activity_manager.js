const {EventManager}       = require("./event_manager");
const {InitializeActivity} = require("../activities/initialize_activity");

class ActivityManager
{
	/**
	 * Create an instance of the ActivityManager
	 */
	constructor() {
		this._activeActivity = null;
		this._activityQueue  = [];

		EventManager.subscribe("activity-finished", this.onActivityFinished, this);
		EventManager.subscribe("activity-started",  this.onActivityStarted,  this);
	}

	/**
	 * Clean the activity manager
	 * @return {Undefined}
	 */
	clean() {
		console.log("Cleaning activity manager...");
		EventManager.unsubscribe("activity-finished", this.onActivityFinished);
		EventManager.unsubscribe("activity-started",  this.onActivityStarted);
		if (this._activeActivity)
			this._activeActivity.finish();
		this._activeActivity = null;
	}

	/**
	 * Executed when a activity has finished
	 * @param  {Activity} activity
	 * @param  {Activity|Undefined} nextActivity
	 * @return {Undefined}
	 */
	onActivityFinished(activity, nextActivity) {
		activity.clean();
		if (nextActivity)
			nextActivity.start();
		else
			this.finish(activity.exitCode());
	}

	/**
	 * Executed when a activity has been started
	 * @param  {Activity} activity
	 * @return {Undefined}
	 */
	onActivityStarted(activity) {
		this._activeActivity = activity;
		activity.run();
	}

	/**
	 * Executed when all activitys have finished
	 * @return {Undefined}
	 */
	finish(exitCode) {
		this._activeActivity = null;
		EventManager.emit("activitymanager-finished", [exitCode]);
	}
}

// Export the module
module.exports = { ActivityManager };
