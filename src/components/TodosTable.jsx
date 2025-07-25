import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TodosTable() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10");
        setTodos(res.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleToggle = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, updatedTodo);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo = {
      title: newTodoTitle,
      completed: false,
      userId: 1,
    };

    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/todos", newTodo);
      const createdTodo = {
        ...newTodo,
        id: todos.length + 1,
      };
      setTodos([createdTodo, ...todos]);
      setNewTodoTitle("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Todos Table</h1>

      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
      />

      <form onSubmit={handleAddTodo} className="mb-4 flex gap-2 items-center justify-start">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add new todo..."
          className="border border-gray-300 rounded px-3 py-2 w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">Todo</th>
            <th className="py-2 px-4 border-b">Completed</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{todo.title}</td>
              <td className="py-2 px-4">
                {todo.completed ? "✅" : "❌"}
              </td>
              <td className="py-2 px-4">{todo.userId}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
