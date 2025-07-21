import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HabitGrid from './components/HabitGrid';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';

const LOCAL_KEY = 'habitkit.habits';
const THEME_KEY = 'habitkit.theme';

const PLACEHOLDER_HABITS_DATA = [
  {
    id: 'ph1',
    name: 'Drink Water',
    emoji: '💧',
    frequency: 'daily',
    color: '#60a5fa',
    days: Array(7).fill(false),
    streak: 0,
    lastChecked: null,
  },
  {
    id: 'ph2',
    name: 'Read Book',
    emoji: '📖',
    frequency: 'monthly',
    color: '#fbbf24',
    days: Array(12).fill(false),
    streak: 0,
    lastChecked: null,
  },
];

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    console.log('Loaded habits from localStorage:', saved); // Debug log
    if (saved) {
      try {
        const parsed = JSON.parse(saved, (key, value) => {
          return key === 'lastChecked' && value ? new Date(value) : value;
        });
        // Only use parsed data if it’s a non-empty array with valid habit structure
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(h => h.id && h.days)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse habits:', e);
      }
    }
    console.log('Falling back to PLACEHOLDER_HABITS_DATA');
    return [...PLACEHOLDER_HABITS_DATA]; // Return a new array to avoid reference issues
  });

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'dark';
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(habits, (key, value) => {
        return key === 'lastChecked' ? (value instanceof Date ? value.toISOString() : value) : value;
      });
      localStorage.setItem(LOCAL_KEY, serialized);
      console.log('Habits saved to localStorage:', habits); // Debug log
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }, [habits]);

  const addHabit = (newHabit) => {
    setHabits((prev) => [...prev, { ...newHabit, id: Date.now().toString() }]);
    console.log('Habit added:', newHabit); // Debug add
  };

  const updateHabit = (index, updatedHabit) => {
    setHabits((prev) => {
      const newHabits = [...prev];
      newHabits[index] = { ...newHabits[index], ...updatedHabit };
      console.log('Habit updated at index', index, 'with:', updatedHabit); // Debug update
      return newHabits;
    });
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    console.log('Habit deleted with id:', id); // Debug delete
  };

  return (
    <div className={`app-container ${theme === 'dark' ? 'dark' : ''}`}>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="habit-container">
        <div className="habit-grid">
          {habits.map((habit, idx) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              idx={idx}
              updateHabit={updateHabit}
              deleteHabit={deleteHabit}
            />
          ))}
        </div>
        <button
          className="fab"
          onClick={() => setShowForm(true)}
          title="Add Habit"
        >
          +
        </button>
        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onAdd={addHabit}
          />
        )}
      </main>
    </div>
  );
}

export default App;