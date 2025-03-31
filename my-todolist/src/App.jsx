import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState(getSavedTasks());
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTasks, setFilterTasks] = useState([]);

  function getSavedTasks() {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(e) {
    e.preventDefault();
    setTasks((prev) => [...prev, { todo: input, completed: false }]);
    setInput("");
  }

  function handleEditingTask(index) {
    if (editIndex === index) {
      setTasks(
        tasks.map((task, i) =>
          i === index ? { ...task, todo: editInput } : task
        )
      );
      setEditIndex(null);
    } else {
      setEditIndex(index);
      setEditInput(tasks[index].todo);
    }
  }

  function handleToggleTaskCompleted(index) {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeletedTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filterTasks = tasks.filter((task) =>
        task.todo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilterTasks(filterTasks);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [tasks, searchQuery]);

  return (
    <div className="mt-10 w-full sm:w-[25rem] mx-auto">
      <h1 className="text-3xl font-bold">TODO LIST</h1>

      <form
        onSubmit={handleAddTask}
        className="mt-8 flex justify-between gap-5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="請輸入待辦事項"
          className="rounded-3xl px-4 py-2 w-full bg-neutral-400 text-white outline-none"
        />

        <button className="cursor-pointer">
          <FaPlus />
        </button>
      </form>

      <div>
        <input
          type="text"
          placeholder="查詢待辦事項"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border w-full mt-5 rounded-3xl px-4 py-2 outline-none border-neutral-400"
        />
      </div>

      <div className="mt-8 w-full">
        <ul className="flex flex-col gap-5">
          {filterTasks.map((task, index) => (
            <li key={index} className="flex justify-between items-center gap-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleTaskCompleted(index)}
                  className="cursor-pointer"
                >
                  {task.completed ? (
                    <IoIosCheckmarkCircle size="1.5rem" />
                  ) : (
                    <MdOutlineRadioButtonUnchecked size="1.5rem" />
                  )}
                </button>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="border border-neutral-400 rounded-3xl px-4 py-2 w-full"
                  />
                ) : (
                  <span
                    className={`px-4 py-2 ${
                      task.completed && "line-through text-gray-500"
                    }`}
                  >
                    {task.todo}
                  </span>
                )}
              </div>

              <div className="flex gap-5">
                <button
                  onClick={() => handleEditingTask(index)}
                  className="cursor-pointer"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDeletedTask(index)}
                  className="cursor-pointer"
                >
                  <IoClose size="1.5rem" />
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-neutral-500">您尚未新增待辦事項</p>
          )}
          {filterTasks.length === 0 && searchQuery && (
            <p className="text-neutral-500">Oops! 未查詢到此事項</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
