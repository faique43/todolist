import "./App.css";
import Web3 from "web3";
import contractABI from "./abi.json";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiCheckCircle } from "react-icons/hi";

function App() {
  const web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  const contractAddress = "0x620964fab144af97bf77c9f26b1415193937b425";
  const todoContract = new web3.eth.Contract(contractABI, contractAddress);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const taskList = await todoContract.methods.getAllTasks().call();
    const filteredTasks = taskList.filter((task) => !task.deleted);
    setTasks(filteredTasks);
  };
  
  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput) {
      return;
    }
    await todoContract.methods.addTask(taskInput).send({
      from: window.ethereum.selectedAddress,
    });
    setTaskInput("");
    loadTasks();
  };
  
  const toggleComplete = async (taskId) => {
    await todoContract.methods.toggleComplete(taskId).send({
      from: window.ethereum.selectedAddress,
    });
    loadTasks();
  };
  
  const toggleDelete = async (taskId) => {
    await todoContract.methods.toggleDelete(taskId).send({
      from: window.ethereum.selectedAddress,
    });
    loadTasks();
  };
  
  const getTaskCount = async () => {
    const taskList = await todoContract.methods.getAllTasks().call();
    const filteredTasks = taskList.filter((task) => !task.deleted);
    return filteredTasks.length;
  };

  const deleteAll = async () => {
    const taskCount = await getTaskCount();
    for (let i = 0; i < taskCount; i++) {
      await todoContract.methods.toggleDelete(i).send({
        from: window.ethereum.selectedAddress,
      });
    }
    loadTasks();
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My ToDo List</h1>
        <form onSubmit={addTask}>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Add new task"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="border-gray-300 border-2 rounded-l py-2 px-4 w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r"
            >
              Add
            </button>
          </div>
        </form>
        <ul className="bg-white shadow-md p-4 rounded-md">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center justify-between py-2">
              <span
                className={`task-content ${task.completed ? "completed text-green-500" : ""}`}
              >
                {task.content}
              </span>
              <div className="flex flex-end">
              <button
                className="delete-btn text-red-600 hover:text-red-800 border-4 rounded-md p-2 me-3"
                onClick={() => toggleDelete(index)}
                >
                <RiDeleteBinLine />
              </button>
              <button
                className="success-btn text-green-600 hover:text-green-800 border-4 rounded-md p-2"
                onClick={() => toggleComplete(index)}
                >
                <HiCheckCircle />
              </button>
                </div>
              {task.completed && (
                <span className="task-status text-green-500 ml-4">
                  Completed
                </span>
              )}
            </li>
          ))}
        </ul>
        <button
          className="delete-btn bg-blue-500 text-white font-bold py-2 px-4 mt-4 rounded-lg"
          onClick={() => deleteAll()}
        >
          Delete All
        </button>
      </div>
    </div>
  );
}

export default App;
