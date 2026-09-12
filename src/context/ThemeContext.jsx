import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create Theme Context
const ThemeContext = createContext(null);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedAnimation = localStorage.getItem('animationEnabled');

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }

    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }

    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
      applyPrimaryColor(savedPrimaryColor);
    }

    if (savedAnimation !== null) {
      setAnimationEnabled(savedAnimation === 'true');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Apply font size to document
  const applyFontSize = useCallback((size) => {
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[size] || '16px';
  }, []);

  // Apply primary color to document
  const applyPrimaryColor = useCallback((color) => {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(color));
  }, []);

  // Helper: Convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '102, 126, 234';
  };

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  // Set theme directly
  const setThemeMode = useCallback((newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', String(newState));
      return newState;
    });
  }, []);

  // Set sidebar state
  const setSidebarState = useCallback((collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  }, []);

  // Set font size
  const setFontSizePreference = useCallback((size) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('fontSize', size);
  }, [applyFontSize]);

  // Set primary color
  const setPrimaryColorPreference = useCallback((color) => {
    setPrimaryColor(color);
    applyPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
  }, [applyPrimaryColor]);

  // Toggle animations
  const toggleAnimations = useCallback(() => {
    setAnimationEnabled(prev => {
      const newState = !prev;
      localStorage.setItem('animationEnabled', String(newState));
      document.documentElement.style.setProperty('--animations-enabled', newState ? '1' : '0');
      return newState;
    });
  }, []);

  // Reset to defaults
  const resetTheme = useCallback(() => {
    setTheme('light');
    setSidebarCollapsed(false);
    setFontSize('medium');
    setPrimaryColor('#667eea');
    setAnimationEnabled(true);
    
    document.documentElement.setAttribute('data-theme', 'light');
    applyFontSize('medium');
    applyPrimaryColor('#667eea');
    document.documentElement.style.setProperty('--animations-enabled', '1');
    
    localStorage.removeItem('theme');
    localStorage.removeItem('sidebarCollapsed');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('animationEnabled');
  }, [applyFontSize, applyPrimaryColor]);

  // Context value
  const value = {
    theme,
    sidebarCollapsed,
    fontSize,
    primaryColor,
    animationEnabled,
    toggleTheme,
    setThemeMode,
    toggleSidebar,
    setSidebarState,
    setFontSize: setFontSizePreference,
    setPrimaryColor: setPrimaryColorPreference,
    toggleAnimations,
    resetTheme,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;