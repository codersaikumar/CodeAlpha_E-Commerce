
import { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', mobile: '', role: 'user' });
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:3700/signup', form);
      alert('Signup successful!');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      alert('Signup failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        <input type="text" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="number" placeholder="Mobile" onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
}

export default Signup;
