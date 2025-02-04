import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('tempEmail'); // Ensure this is stored properly
      console.log("Sending data:", { email, otp }); // Debug log
  
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }) // Ensure this is correctly formatted
      });
  
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Verification failed');
      }
  
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>
      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default OtpVerification;