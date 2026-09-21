import { Outlet } from "react-router"
import Navbar from "./components/Navigation/Navbar"
import { useState } from "react"
import { useEffect } from "react";
import { authClient } from "./lib/auth-clients";

type Theme = 'light' | 'dark';

function App() {
  const { data: session } = authClient.useSession()

  if (session) {
    console.log(session)
  }

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

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <Outlet context={{theme, setTheme}}/>
    </>
  )
}

export default App
