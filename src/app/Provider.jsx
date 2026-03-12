"use client";

import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {/* Aquí es donde forzamos el Negro puro (#000000) para el modo oscuro */}
      <div className="dark:bg-black dark:text-gray-200 text-gray-700 transition-colors duration-300 min-h-screen select-none">
        {children}
      </div>
    </ThemeProvider>
  );
}