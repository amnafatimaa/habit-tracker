import React, { useEffect } from 'react';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';

function Header({ theme, onToggleTheme }) {
  // Force re-render or sync on theme change
  useEffect(() => {
    // This effect ensures the component reacts to initial theme prop
    console.log('Header theme updated:', theme);
  }, [theme]);

  return (
    <header className="header">
      <span className="header-title">Habit Tracker</span>
      <label className="theme-toggle-switch">
        <input
          type="checkbox"
          className="theme-toggle-input"
          checked={theme === 'dark'} // Sync with theme prop
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