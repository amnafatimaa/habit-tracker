import React, { useMemo } from 'react';

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const weekLabels = ['W1', 'W2', 'W3', 'W4'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getCurrentPeriodIdx(frequency) {
  const d = new Date();
  if (frequency === 'daily') return (d.getDay() + 6) % 7; // Monday=0
  if (frequency === 'weekly') return getWeekOfMonth(d) - 1; // 0-based
  if (frequency === 'monthly') return d.getMonth();
  return 0;
}

function getWeekOfMonth(date) {
  // Returns 1-based week of month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay - 1) / 7);
}

function calculateStreak(days, currentIdx) {
  // Streak is the number of consecutive checked periods up to and including the current period, going backwards
  let streak = 0;
  for (let i = currentIdx; i >= 0; i--) {
    if (days[i]) streak++;
    else break;
  }
  return streak;
}

function calculateBestStreak(days) {
  let best = 0, current = 0;
  for (let i = 0; i < days.length; i++) {
    if (days[i]) current++;
    else current = 0;
    if (current > best) best = current;
  }
  return best;
}

function calculateCompletion(days) {
  const total = days.length;
  const done = days.filter(Boolean).length;
  return total ? Math.round((done / total) * 100) : 0;
}

function HabitCard({ habit, idx, updateHabit, deleteHabit }) {
  const { frequency, color = '#7dd6c0' } = habit;
  let labels = dayLabels;
  if (frequency === 'weekly') labels = weekLabels;
  if (frequency === 'monthly') labels = monthLabels;

  const currentIdx = getCurrentPeriodIdx(frequency);

  const handleToggle = (periodIdx) => {
    const newDays = habit.days.slice();
    newDays[periodIdx] = !newDays[periodIdx];
    const newStreak = calculateStreak(newDays, currentIdx);
    updateHabit(idx, { ...habit, days: newDays, streak: newStreak, lastChecked: new Date() });
  };

  // Reset logic for each frequency
  React.useEffect(() => {
    const now = new Date();
    const last = habit.lastChecked ? new Date(habit.lastChecked) : null;
    let shouldReset = false;
    if (!last) shouldReset = true;
    else if (frequency === 'daily') {
      // Reset if new week (ISO week)
      shouldReset = now.getFullYear() !== last.getFullYear() || getWeekNumber(now) !== getWeekNumber(last);
    } else if (frequency === 'weekly') {
      // Reset if new month
      shouldReset = now.getFullYear() !== last.getFullYear() || now.getMonth() !== last.getMonth();
    } else if (frequency === 'monthly') {
      // Reset if new year
      shouldReset = now.getFullYear() !== last.getFullYear();
    }
    if (shouldReset) {
      updateHabit(idx, { ...habit, days: Array(habit.days.length).fill(false), streak: 0, lastChecked: now });
    }
    // eslint-disable-next-line
  }, []);

  function getWeekNumber(d) {
    // ISO week number
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNo;
  }

  // Stats
  const bestStreak = useMemo(() => calculateBestStreak(habit.days), [habit.days]);
  const completion = useMemo(() => calculateCompletion(habit.days), [habit.days]);

  return (
    <div className="habit-card" style={{ background: 'var(--card-bg)' }}>
      <div className="habit-emoji">{habit.emoji || '🌱'}</div>
      <div className="habit-name">{habit.name}</div>
      {/* Mini calendar/heatmap style row */}
      <div className="checkbox-row">
        {labels.map((d, i) => (
          <div
            key={i}
            title={d}
            className={`habit-box ${habit.days[i] ? 'checked' : ''}`}
            onClick={() => handleToggle(i)}
            tabIndex={0}
            role="button"
            aria-pressed={habit.days[i]}
            style={habit.days[i] ? { background: color, borderColor: color } : {}}
          >
            <span className="habit-box-label">{d}</span>
          </div>
        ))}
      </div>
      <div className="streak">🏆 Streak: {bestStreak} &nbsp;✅ {completion}%</div>
      <button className="delete-btn" title="Delete" onClick={() => deleteHabit(habit.id)}>
        <span className="trash" role="img" aria-label="Delete">🗑️</span>
      </button>
    </div>
  );
}

export default HabitCard;