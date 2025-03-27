import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashBoardPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verifyemail" element={<VerificationPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>  
    </Router>
  );
}

export default App;