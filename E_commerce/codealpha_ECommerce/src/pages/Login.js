import { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn, setUser } = useAuth(); // ✅ Only call useAuth once
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3700/login', { email, password });
      alert(res.data.message);
      setIsLoggedIn(true);

      setUser(res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin'); // admin dashboard
      } else {
        navigate('/products'); // normal user homepage
      } // ⬅ store user info in context
   
    } catch (err) {
      alert('Login failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
