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
    days: [true, true, false, true, false, false, false],
    streak: 2,
    lastChecked: null,
  },
  {
    id: 'ph2',
    name: 'Read Book',
    emoji: '📖',
    frequency: 'monthly',
    color: '#fbbf24',
    days: [true, false, true, false, true, false, false, true, false, false, false, true],
    streak: 2,
    lastChecked: null,
  },
];

function App() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) === 'dark' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [placeholderHabits, setPlaceholderHabits] = useState(PLACEHOLDER_HABITS_DATA);

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Load from localStorage
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) setHabits(JSON.parse(data));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit) => {
    setHabits([...habits, habit]);
  };

  const updateHabit = (idx, updated) => {
    setHabits(habits.map((h, i) => (i === idx ? updated : h)));
  };

  const deleteHabit = (idx) => {
    setHabits(habits.filter((_, i) => i !== idx));
  };

  // Placeholder handlers
  const updatePlaceholderHabit = (idx, updated) => {
    setPlaceholderHabits(placeholderHabits.map((h, i) => (i === idx ? updated : h)));
  };
  const deletePlaceholderHabit = (idx) => {
    setPlaceholderHabits(placeholderHabits.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Header darkMode={darkMode} onToggleTheme={() => setDarkMode(d => !d)} />
      {habits.length === 0 ? (
        <div className="habit-grid">
          {placeholderHabits.map((habit, idx) => (
            <HabitCard key={habit.id} habit={habit} idx={idx} updateHabit={updatePlaceholderHabit} deleteHabit={deletePlaceholderHabit} />
          ))}
        </div>
      ) : (
        <HabitGrid habits={habits} updateHabit={updateHabit} deleteHabit={deleteHabit} />
      )}
      <button className="fab" onClick={() => setShowForm(true)} title="Add Habit">+</button>
      {showForm && (
        <HabitForm
          onClose={() => setShowForm(false)}
          onAdd={(habit) => {
            addHabit(habit);
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}

export default App;
