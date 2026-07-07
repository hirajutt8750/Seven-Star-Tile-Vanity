import React, { createContext, useState, useEffect, useContext } from "react";

// Naya, alag Context — CartContext ko bilkul touch nahi karta
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("site-theme") || "dark",
  );

  useEffect(() => {
    // Root <html> tag par data-theme attribute set hota hai
    // theme-light.css isi attribute ko check karti hai
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
