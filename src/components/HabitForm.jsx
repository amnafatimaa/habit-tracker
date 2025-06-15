import React, { useState } from 'react';

const VIBRANT_COLORS = [
  '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#4ade80', '#f472b6', '#fb7185', '#f59e42', '#10b981', '#6366f1', '#e879f9', '#fcd34d', '#f472b6', '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#4ade80', '#f472b6', '#fb7185', '#f59e42', '#10b981', '#6366f1', '#e879f9', '#fcd34d', '#f472b6'
];

function getRandomColor() {
  return VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
}

function HabitForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [color, setColor] = useState(getRandomColor());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    let days;
    if (frequency === 'daily') days = Array(7).fill(false);
    else if (frequency === 'weekly') days = Array(4).fill(false); // 4 weeks in a month
    else days = Array(12).fill(false); // 12 months in a year
    onAdd({
      id: Date.now(),
      name: name.trim(),
      emoji: emoji.trim(),
      frequency,
      color,
      days,
      streak: 0,
      lastChecked: null,
    });
    setName('');
    setEmoji('');
    setFrequency('daily');
    setColor(getRandomColor());
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <label>
          Habit Name*
          <input value={name} onChange={e => setName(e.target.value)} required maxLength={32} />
        </label>
        <label>
          Emoji/Icon
          <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} placeholder="e.g. 🏃" />
        </label>
        <label>
          Frequency
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label>
          Card Color
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{width:'3rem',height:'2rem',border:'none',background:'none',padding:0,marginLeft:'0.5rem',verticalAlign:'middle'}} />
        </label>
        <div className="modal-actions">
          <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default HabitForm; 