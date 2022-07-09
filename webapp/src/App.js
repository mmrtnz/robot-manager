// External Dependencies
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Internal Dependencies
import AppBar from './AppBar';
import Login from './login';
import Dashboard from './dashboard';

const defaultContext = { user: null, socket: null };

export const GlobalContext = React.createContext(defaultContext);

const Layout = () => (
  <>
    <AppBar/>
    <Outlet />
  </>
)

const App = () => {
  const [globalStore, setGlobalStore] = useState(defaultContext);

  // Restore current user data and socket connection. Redirect based on session 
  // status.
  useEffect(() => {
    const user = JSON.parse(Cookies.get('user'));
    
    if (user) {
      const socket = io('http://localhost:8080');

      setGlobalStore({ ...globalStore, user, socket });
      
      if (document.location.pathname === '/') {
        window.location.pathname = '/dashboard';
      }
    } else if (document.location.pathname !== '/') {
      window.location.pathname = '/';
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ globalStore, setGlobalStore }}>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
  }

export default App;
