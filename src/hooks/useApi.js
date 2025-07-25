// Todos CRUD App with React + API Integration
// This assumes you're using a basic React app with functional components.
// This version includes full CRUD functionality using the public Hashnode Todos API.

import React, { useEffect, useState } from 'react';
import './Todos.css';

const API_URL = 'https://freeapi.hashnode.space/todos';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: newTodo, completed: false, userId: 1 })
      });
      const created = await response.json();
      setTodos(prev => [...prev, created]);
      setNewTodo('');
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditedText(text);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: editedText })
      });
      const updated = await response.json();
      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
      setEditingId(null);
      setEditedText('');
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="todos-container">
      <h2>Todos Table</h2>
      <input
        type="text"
        placeholder="Add new todo"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
      />
      <button onClick={handleCreate}>Add</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Todo</th>
              <th>Completed</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.id}>
                <td>
                  {editingId === todo.id ? (
                    <input
                      value={editedText}
                      onChange={e => setEditedText(e.target.value)}
                    />
                  ) : (
                    todo.todo
                  )}
                </td>
                <td>{todo.completed ? '✅' : '❌'}</td>
                <td>{todo.userId}</td>
                <td>
                  {editingId === todo.id ? (
                    <>
                      <button onClick={() => handleUpdate(todo.id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(todo.id, todo.todo)}>Edit</button>
                      <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
