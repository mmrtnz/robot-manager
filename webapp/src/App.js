// External Dependencies
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Internal Dependencies
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
