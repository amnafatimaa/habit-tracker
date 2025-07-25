import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

function useApi() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://api.freeapi.app/api/v1/todos';

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setHabits(data.data.data.map(h => ({
          ...h,
          days: Array(h.frequency === 'daily' ? 7 : h.frequency === 'weekly' ? 4 : 12).fill(false),
          streak: h.streak || 0,
          lastChecked: h.lastChecked || null,
        })));
      } else {
        throw new Error('Failed to fetch habits');
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const createHabit = async (habit) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: habit.name,
          completed: false,
          emoji: habit.emoji,
          frequency: habit.frequency,
          color: habit.color,
          streak: 0,
          lastChecked: null,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setHabits([...habits, { ...data.data, days: habit.days, streak: 0, lastChecked: null }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateHabit = async (id, habit) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setHabits(habits.map(h => h._id === id ? { ...h, ...data.data } : h));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setHabits(habits.filter(h => h._id !== id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { habits, loading, error, createHabit, updateHabit, deleteHabit };
}

export default useApi;