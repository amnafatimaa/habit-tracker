function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="header">
      Habit Tracker
      <button className="theme-toggle" onClick={onToggleTheme} title="Toggle dark mode">
        {darkMode ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

export default Header; 