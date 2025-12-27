import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // SAVE THE TOKEN! This is crucial.
        localStorage.setItem('tutorToken', data.token);
        localStorage.setItem('tutorName', data.username);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
        console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Tutor Login</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleLogin} className="login-form">
        <input 
          type="text" 
          placeholder="Username" 
          className="login-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="login-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
}