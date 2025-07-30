import './AdminLogin.css';
import { useState } from "react";

function AdminLogin({ onLogin }) {
  // const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123' && email=== 'admin123@gmail.com') {
      onLogin();
    } else {
      setError('Invalid Email or Password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <svg className="shield-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 3L4 6v6c0 5.25 3.75 10.125 8 11 4.25-.875 8-5.75 8-11V6l-8-3z" />
          </svg>
          <h2>Admin Access</h2>
          <p>Please authenticate to access the admin panel</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} required>
            <option value="">Select Your Role</option>
            <option value="Administrator">Administrator</option>
            <option value="Candidate">Candidate</option>
          </select> */}

         
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
           <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login to Admin Panel</button>
        </form>

        <div className="demo-info">
          Demo Access:<br />
          Email: admin123@gmail.com<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
