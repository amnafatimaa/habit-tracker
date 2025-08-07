import { useEffect, useState } from 'react';

const API_BASE = 'https://api.freeapi.app/api/v1/todos';

export const useApi = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        if (data.success && data.data) {
          setTodos(data.data);
        } else {
          console.error('Error fetching:', data.message);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return { todos, setTodos, loading };
};
