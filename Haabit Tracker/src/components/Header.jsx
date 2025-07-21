import React from 'react';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';

function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <span className="header-title">Habit Tracker</span>
      <label className="theme-toggle-switch">
        <input
          type="checkbox"
          className="theme-toggle-input"
          checked={theme === 'dark'} // Reflects theme state
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