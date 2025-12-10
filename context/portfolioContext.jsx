'use client';

import { createContext, useContext } from 'react';

const PortfolioContext = createContext({
  portfolio: null,
  slug: null,
});

export const PortfolioProvider = ({ children, portfolio, slug }) => {
  return (
    <PortfolioContext.Provider value={{ portfolio, slug }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return context;
};

