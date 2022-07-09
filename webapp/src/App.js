// External Dependencies
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Internal Dependencies
import AppBar from './AppBar';
import Login from './Login';
import Dashboard from './Dashboard';

const defaultContext = { user: null };

export const GlobalContext = React.createContext(defaultContext);

const Layout = () => (
  <>
    <AppBar/>
    <Outlet />
  </>
)

const App = () => {
  const [globalStore, setGlobalStore] = useState(defaultContext);

  // Restore current user data from cookie and redirect into or out of app 
  // depending on whether previous session is still valid. 
  useEffect(() => {
    const user = Cookies.get('user');
    
    if (user) {
      setGlobalStore({...globalStore, user: JSON.parse(user) });
      
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
