pragma solidity >=0.4.22 <0.9.0;

contract ToDoList {
    struct Task {
        uint256 id;
        string content;
        bool completed;
        bool deleted;
    }

    Task[] private tasks;

    event TaskAdded(uint256 id, string content);
    event TaskCompleted(uint256 id);
    event TaskDeleted(uint256 id);

    function addTask(string memory _content) public {
        uint256 id = tasks.length;
        tasks.push(Task(id, _content, false, false));
        emit TaskAdded(id, _content);
    }

    function getAllTasks() public view returns (Task[] memory) {
        uint256 activeTaskCount = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].deleted) {
                activeTaskCount++;
            }
        }

        Task[] memory activeTasks = new Task[](activeTaskCount);
        uint256 activeTaskIndex = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].deleted) {
                activeTasks[activeTaskIndex] = tasks[i];
                activeTaskIndex++;
            }
        }

        return activeTasks;
    }

    function toggleComplete(uint256 _id) public {
        Task storage task = tasks[_id];
        require(!task.deleted, "Task has been deleted");
        task.completed = !task.completed;
        emit TaskCompleted(_id);
    }

    function toggleDelete(uint256 _id) public {
        Task storage task = tasks[_id];
        require(!task.deleted, "Task has already been deleted");
        task.deleted = true;
        emit TaskDeleted(_id);
    }

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }
}
