import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  // Hooks
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle Login
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    try {
      // const response = await fetch('http://localhost:5000/api/login', {
      const response = await fetch('https://powerleveling.xyz/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      // Check if successful
      if (!response.ok) {
        setMessage('Invalid login or password');
        throw new Error('Invalid login or password');
      }

      // Parse response
      const data = await response.json();
      const { userId, login: userLogin, displayName, email, isVerified, friends, friendRequests, friendRequestsSent, profile } = data;

      // Check verification
      if (isVerified) {
        // Store user data
        localStorage.setItem('user', JSON.stringify({ userId, userLogin, displayName, email, friends, profile }));

        // Nav landing page
        setMessage('');
        navigate('/dashboard', { state: { userLogin, displayName } });
      } else {
        setError('Account is not verified.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong, please try again.');
    }
  };
      
  return (
    <>
      <div className="headerText">LOGIN</div>

      <div id="loginDiv">
        <br />
          <input
            type="text"
            id="userName"
            className='bodyText'
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required

            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "1vh",
              backgroundColor: "white",
              color: "Black"
            }}
          />
          
        <br />
          <input
            type="password"
            id="loginPassword"
            className='bodyText'
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required

            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "1vh",
              marginBottom: "1vh",
              backgroundColor: "white",
              color: "Black"
            }}
          />
          
        <br />
          <input
            type="submit"
            id="loginButton"
            className="button"
            value="SUBMIT"
            onClick={doLogin}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "1vh",
              marginLeft: "-11vw",
            }}
          /> 

          <span
            id="loginResult"
            style={{
              display: "block",
              marginTop: "10px",
              fontWeight: "bold",
              color: "red"
            }}
          >
            {message}
          </span>
      </div>
    </>
  );
}

export default Login;
