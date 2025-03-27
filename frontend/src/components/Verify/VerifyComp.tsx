import React, { useState } from 'react';3
import { useLocation, useNavigate } from 'react-router-dom';

const Verify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // get userId
  const userId = location.state?.userId;
  // Hooks
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if userId is missing (causes the header and box to not apear somtimes)
  if (!userId) {
    navigate('/register');
    return null;
  }

  const doVerify = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      // const response = await fetch('http://localhost:5000/api/verifyEmail', {
      const response = await fetch('https://powerleveling.xyz/api/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Verification failed.');
      }

      const data = await response.json();
      const { isVerified } = data;

      if (isVerified) {
        setSuccessMessage('Email verified successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Invalid verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong, please try again.');
    }
  };
      
  return (
    <>
      <div className="headerText2">VERIFY</div>
      <div id="loginDiv">
        <br />
          <input
            type="text"
            id="loginName"
            className='bodyText'
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "3vw",
              backgroundColor: "white",
              color: "Black",
            }}
          />
        <br />
          <input
            type="submit"
            id="loginButton"
            className="button"
            value="SUBMIT"
            onClick={doVerify}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "2vh",
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
            {successMessage}
          </span>
      </div>
    </>
  );
}

export default Verify;
