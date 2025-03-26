import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage.tsx';
import CardPage from './pages/CardPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cards" element={<CardPage />} />
      </Routes>
    </Router>
  );
}

export default App;