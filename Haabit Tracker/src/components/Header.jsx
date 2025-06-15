function SunIcon() {
  return (
    <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>
  );
}
function MoonIcon() {
  return (
    <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="#f9fafb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
  );
}

function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="header">
      <span className="header-title">Habit Tracker</span>
      <label className="theme-toggle-switch">
        <input
          type="checkbox"
          className="theme-toggle-input"
          checked={darkMode}
          onChange={onToggleTheme}
          aria-label="Toggle dark mode"
        />
        <span className="theme-toggle-slider">
          <span className="theme-toggle-knob">
            <SunIcon />
            <MoonIcon />
          </span>
        </span>
      </label>
    </header>
  );
}

export default Header; 