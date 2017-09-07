const {EventManager} = require("./event_manager");

// Tasks
const {InitializeTask} = require("./tasks/initialize_task");

class TaskManager {
    /**
     * Create an instance of the TaskManager
     */
    constructor() {
        this._activeTask = null;

        EventManager.subscribe("task-finished", this.onTaskFinished, this);
        EventManager.subscribe("task-started",  this.onTaskStarted,  this);
    }

    /**
     * Start the task manager, which will start the initialization task
     * @return {Undefined}
     */
    start() {
        let task = new InitializeTask();
        task.start();
    }

    onTaskFinished(task, nextTask) {
    	task.clean();
    	if (nextTask)
    		nextTask.start();
    }

    onTaskStarted(task) {
    	console.log("Executing task");
    	task.run();
    }
}

module.exports = { TaskManager };
