import HabitCard from './HabitCard';

function HabitGrid({ habits, updateHabit, deleteHabit }) {
  return (
    <div className="habit-grid">
      {habits.map((habit, idx) => (
        <HabitCard
          key={habit.id || idx}
          habit={habit}
          idx={idx}
          updateHabit={updateHabit}
          deleteHabit={deleteHabit}
        />
      ))}
    </div>
  );
}

export default HabitGrid; 