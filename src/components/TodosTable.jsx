import React, { useState } from 'react';
import Todos from '../hooks/useApi';

const API_BASE = 'https://api.freeapi.app/api/v1/todos';

function TodosTable() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to handle errors
  const handleError = (err, action) => {
    console.error(`${action} failed:`, err);
    setError(`Failed to ${action.toLowerCase()}. Error: ${err.message}`);
    setTimeout(() => setError(''), 5000);
  };

  // CREATE - Add new todo
  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo.trim(),
          isCompleted: false,
        }),
      });
      
      const data = await res.json();
      console.log('Add response:', data);
      
      if (data.success && data.data) {
        setTodos([...todos, data.data]);
        setNewTodo('');
      } else {
        throw new Error(data.message || 'Failed to create todo');
      }
    } catch (err) {
      handleError(err, 'Add todo');
    } finally {
      setLoading(false);
    }
  };

  // READ - This is handled by the todos state (no initial fetch)

  // UPDATE - Edit todo
  const handleEdit = async (id) => {
    if (!editingText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const todo = todos.find((t) => t._id === id);
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH', // Try PATCH instead of PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingText.trim(),
          isCompleted: todo.isCompleted,
        }),
      });
      
      const data = await res.json();
      console.log('Edit response:', data, 'Status:', res.status);
      
      if (res.ok && data.success && data.data) {
        setTodos(todos.map((t) => (t._id === id ? data.data : t)));
        setEditingId(null);
        setEditingText('');
      } else {
        // If API fails, update locally as fallback
        console.log('API update failed, updating locally');
        setTodos(todos.map((t) => 
          t._id === id ? { ...t, title: editingText.trim() } : t
        ));
        setEditingId(null);
        setEditingText('');
        setError('Updated locally (API update failed)');
      }
    } catch (err) {
      // Fallback: update locally if API fails
      console.log('Edit API error, updating locally:', err);
      setTodos(todos.map((t) => 
        t._id === id ? { ...t, title: editingText.trim() } : t
      ));
      setEditingId(null);
      setEditingText('');
      setError('Updated locally (API unavailable)');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Toggle completion status
  const handleToggle = async (id) => {
    // Find the current todo and calculate new status
    const currentTodo = todos.find((t) => t._id === id);
    const newCompletedStatus = !currentTodo.isCompleted;
    
    // Update UI immediately - this is the primary update
    setTodos(prevTodos => 
      prevTodos.map(t => 
        t._id === id ? { ...t, isCompleted: newCompletedStatus } : t
      )
    );
    
    // Try to sync with API in background (optional)
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentTodo.title,
          isCompleted: newCompletedStatus,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Toggle synced with API:', data);
      } else {
        console.log('API sync failed, but local update persists');
      }
    } catch (err) {
      console.log('API sync error, but local update persists:', err.message);
    }
  };

  // DELETE - Remove todo
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Delete response status:', res.status);
      
      if (res.ok || res.status === 204) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        // Fallback: delete locally
        console.log('API delete failed, deleting locally');
        setTodos(todos.filter((todo) => todo._id !== id));
        setError('Deleted locally (API delete failed)');
      }
    } catch (err) {
      // Fallback: delete locally if API fails
      console.log('Delete API error, deleting locally:', err);
      setTodos(todos.filter((todo) => todo._id !== id));
      setError('Deleted locally (API unavailable)');
    } finally {
      setLoading(false);
    }
  };

  // Handle key press for adding todos
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // Handle key press for editing todos
  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleEdit(id);
    }
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditingText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Todo List
        </h1>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Add Todo Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleAdd}
              disabled={loading || !newTodo.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No todos yet!</p>
            <p className="text-sm">Add your first todo above to get started.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`p-4 border rounded-lg transition-all ${
                  todo.isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                {editingId === todo._id ? (
                  /* Edit Mode */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(todo._id)}
                      disabled={loading || !editingText.trim()}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText('');
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex-1 ${
                        todo.isCompleted
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => handleToggle(todo._id)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                          todo.isCompleted
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {todo.isCompleted ? '↶ Undo' : '✓ Done'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(todo._id);
                          setEditingText(todo.title);
                        }}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm font-medium transition-colors duration-200"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm font-medium transition-colors duration-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        
        {/* Todo Count */}
        {todos.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {todos.filter(t => !t.isCompleted).length} of {todos.length} todos remaining
          </div>
        )}
      </div>
    </div>
  );
}

export default TodosTable;