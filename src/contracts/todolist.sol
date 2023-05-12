pragma solidity >=0.4.22 <0.9.0;

contract ToDoList {
    struct Task {
        string content;
        bool completed;
        bool deleted;
    }

    Task[] public tasks;

    function addTask(string memory _content) public {
        tasks.push(Task(_content, false, false));
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

    function toggleComplete(uint256 _index) public {
        Task storage task = tasks[_index];
        task.completed = !task.completed;
    }

    function toggleDelete(uint256 _index) public {
        Task storage task = tasks[_index];
        task.deleted = !task.deleted;
    }

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }
}
