import React, { useState, useEffect } from 'react';

function UserForm({ user, onSubmit, onCancel }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (user) {
      // Pre-fill username and email for editing, password left blank
      setForm({ username: user.username, email: user.email, password: '' });
    } else {
      // Reset form for creation
      setForm({ username: '', email: '', password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      username: form.username,
      email: form.email,
    };

    // Only include password if adding
    if (!user) {
      payload.password = form.password;
    }
    
    // Validate required fields
    if (!payload.username || !payload.email || (!user && !payload.password)) {
      alert('All fields are required');
      return;
    }

    onSubmit(payload);

    // Reset form after submission if creating
    if (!user) {
      setForm({ name: '', email: '', password: '' });
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <input
        className="form-field"
        type="text"
        name="username"
        placeholder="Username"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="form-field"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      {!user && (
        <input
          className="form-field"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      )}
      <div className="button-group">
        <button type="submit">{user ? 'Update' : 'Add Viewer User'}</button>
        {user && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default UserForm;

