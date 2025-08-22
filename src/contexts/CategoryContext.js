import React, { createContext, useContext } from 'react';

const CategoryContext = createContext({
  categories: [],
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
});

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  // Placeholder logic
  const value = {
    categories: [],
    addCategory: () => {},
    updateCategory: () => {},
    deleteCategory: () => {},
  };
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}; 