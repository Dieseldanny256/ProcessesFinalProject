import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import DashBoardPage from './pages/DashBoardPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import OtherProfilePage from './pages/OtherProfilePage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verifyemail" element={<PrivateRoute><VerificationPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashBoardPage /></PrivateRoute>}/>
        <Route path="/profile/:userId" Component={OtherProfilePage} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>}/>
        <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>  
    </Router>
  );
}

export default App;