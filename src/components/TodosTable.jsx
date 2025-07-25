import React, { useState } from 'react';

const TodosTable = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    const newEntry = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    setTodos([newEntry, ...todos]);
    setNewTodo('');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleEdit = (id, title) => {
    setEditingTodoId(id);
    setEditingText(title);
  };

  const handleEditSave = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title: editingText } : todo
    ));
    setEditingTodoId(null);
    setEditingText('');
  };

  return (
    <div className="todos-wrapper">
      <h2>Todos</h2>

      <div className="add-todo">
        <input
          type="text"
          placeholder="Enter a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Todo</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr><td colSpan="3">No Tasks Yet</td></tr>
          ) : (
            todos.map(todo => (
              <tr key={todo.id}>
                <td>
                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    todo.title
                  )}
                </td>
                <td>{todo.completed ? '✅' : '❌'}</td>
                <td>
                  {editingTodoId === todo.id ? (
                    <button onClick={() => handleEditSave(todo.id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleToggle(todo.id)}>Toggle</button>
                      <button onClick={() => handleEdit(todo.id, todo.title)}>Edit</button>
                      <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodosTable;
