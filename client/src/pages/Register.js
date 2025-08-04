import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../logo.svg';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const result = await register(form.username, form.email, form.password);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="container fade-in">
      <img src={logo} alt="logo" className="logo" />
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-field"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          className="form-field"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="form-field"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;

