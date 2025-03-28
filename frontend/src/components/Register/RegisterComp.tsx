import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  // Hooks
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  //const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle Register
  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    //setError('');

    try {
      //const response = await fetch('http://localhost:5000/api/register', {
      const response = await fetch('https://powerleveling.xyz/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password, displayName, email }),
      });

      if (!response.ok) {
        setMessage('Failed to register');
        throw new Error('Registration failed.');
      }

      const data = await response.json();
      const { userId } = data; // UserId

      if (userId) {
        // Nav Verification
        // Save state userID
        navigate('/verify-email', { state: { userId } });
      } else {
        //setError('No userId returned.');
      }
    } catch (err: any) {
      //setError(err.message || 'Something went wrong, please try again.');
    }
  };
      
  return (
    <>
      <div className="headerText2">REGISTER</div>
      <div id="loginDiv">
        <br />
          <label htmlFor="loginName" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="text"
            id="loginName"
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
              backgroundColor: "white",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="loginName" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="email"
            id="loginName"
            className='bodyText'
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              backgroundColor: "white",
              marginTop: "-1vh",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="loginName" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="text"
            id="loginName"
            className='bodyText'
            placeholder="DisplayName"
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              backgroundColor: "white",
              marginTop: "-1vh",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="loginPassword" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
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
              marginBottom: "3vh",
              marginTop: "-1vh",
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
            onClick={doRegister}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "-2vh",
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

export default Register;
