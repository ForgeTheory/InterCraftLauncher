const {EventManager} = require("./event_manager");
const {InitializeTask} = require("./tasks/initialize_task");

class TaskManager {
	/**
	 * Create an instance of the TaskManager
	 */
	constructor() {
		this._activeTask = null;
		this._taskQueue  = [];

		EventManager.subscribe("task-finished", this.onTaskFinished, this);
		EventManager.subscribe("task-started",  this.onTaskStarted,  this);
	}

	/**
	 * Clean the task manager
	 * @return {Undefined}
	 */
	clean() {
		console.log("Cleaning task manager...");
		EventManager.unsubscribe("task-finished", this.onTaskFinished);
		EventManager.unsubscribe("task-started",  this.onTaskStarted);
		if (this._activeTask)
			this._activeTask.finish();
		this._activeTask = null;
	}

	/**
	 * Executed when a task has finished
	 * @param  {Task} task
	 * @param  {Task|Undefined} nextTask
	 * @return {Undefined}
	 */
	onTaskFinished(task, nextTask) {
		task.clean();
		if (nextTask)
			nextTask.start();
		else
			this.finish(task.exitCode());
	}

	/**
	 * Executed when a task has been started
	 * @param  {Task} task
	 * @return {Undefined}
	 */
	onTaskStarted(task) {
		this._activeTask = task;
		task.run();
	}

	/**
	 * Executed when all tasks have finished
	 * @return {Undefined}
	 */
	finish(exitCode) {
		this._activeTask = null;
		EventManager.emit("taskmanager-finished", [exitCode]);
	}
}

// Export the module
module.exports = { TaskManager };
