import { Outlet, useLocation } from "react-router"
import Navbar from "./components/Navigation/Navbar"
import { useState } from "react"
import { useEffect } from "react";

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#121212' : '#FAF8F5';
    document.body.style.transitionDuration = mounted ? '300ms' : '0ms';
    if (!mounted) setMounted(true);
  }, [theme]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.body.classList.add('transitions-enabled');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const location = useLocation()

  return (
    <>
      { location.pathname != '/profile' && <Navbar theme={theme} setTheme={setTheme} /> }
      <Outlet context={{theme, setTheme}}/>
    </>
  )
}

export default App
