'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: {},
  portfolioTheme: null,
  layoutStyle: 'modern',
  updateTheme: () => {},
  updatePortfolioTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primary: '#000000',
    accent: '#ffffff',
    background: '#f5f5f5',
  });
  const [portfolioTheme, setPortfolioTheme] = useState(null);
  const [layoutStyle, setLayoutStyle] = useState('modern');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary', newTheme.primary);
      document.documentElement.style.setProperty('--accent', newTheme.accent);
      document.documentElement.style.setProperty('--background', newTheme.background);
    }
  };

  const updatePortfolioTheme = (portfolio) => {
    if (!portfolio) return;
 
    const portfolioThemeData = {
      themeColor: portfolio.theme_color || '#141414',
      accentColor: portfolio.accent_color || '#ffffff',
      backgroundColor: portfolio.background_color || '#ffffff',
      textColor: portfolio.text_color || '#ffffff',
      fontFamily: portfolio.font_family || 'inherit',
    };

    setPortfolioTheme(portfolioThemeData);
    setLayoutStyle(portfolio.layout_style || 'modern');

    if (typeof document !== 'undefined') {
      // Update CSS variables for portfolio theming
      const root = document.documentElement;
      root.style.setProperty('--portfolio-primary', portfolioThemeData.themeColor);
      root.style.setProperty('--portfolio-accent', portfolioThemeData.accentColor);
      root.style.setProperty('--portfolio-background', portfolioThemeData.backgroundColor);
      root.style.setProperty('--portfolio-text', portfolioThemeData.textColor);
      
      // Apply font family
      if (portfolioThemeData.fontFamily && portfolioThemeData.fontFamily !== 'inherit') {
        root.style.setProperty('--portfolio-font', portfolioThemeData.fontFamily);
        document.body.style.fontFamily = portfolioThemeData.fontFamily;
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      portfolioTheme,
      layoutStyle,
      updateTheme, 
      updatePortfolioTheme,
      isDarkMode, 
      toggleDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);