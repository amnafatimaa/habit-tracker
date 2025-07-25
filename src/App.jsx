import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HabitGrid from './components/HabitGrid';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';
import TodosTable from "./components/TodosTable";

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
    console.log('Loaded habits from localStorage:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved, (key, value) => {
          return key === 'lastChecked' && value ? new Date(value) : value;
        });
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(h => h.id && h.days)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse habits:', e);
      }
    }
    console.log('Falling back to PLACEHOLDER_HABITS_DATA');
    return [...PLACEHOLDER_HABITS_DATA];
  });

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    console.log('Loaded theme from localStorage:', stored);
    return stored === 'dark' || stored === 'light' ? stored : 'dark';
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log('Applying theme:', theme);
    document.body.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
      console.log('Theme saved to localStorage:', theme);
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
      console.log('Habits saved to localStorage:', habits);
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }, [habits]);

  const addHabit = (newHabit) => {
    setHabits((prev) => [...prev, { ...newHabit, id: Date.now().toString() }]);
    console.log('Habit added:', newHabit);
  };

  const updateHabit = (index, updatedHabit) => {
    setHabits((prev) => {
      const newHabits = [...prev];
      newHabits[index] = { ...newHabits[index], ...updatedHabit };
      console.log('Habit updated at index', index, 'with:', updatedHabit);
      return newHabits;
    });
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    console.log('Habit deleted with id:', id);
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
      <TodosTable />
    </div>
  );
}

export default App;