import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import KeyIcon from '@mui/icons-material/Key';

const Settings = () => {
  const [userData, setUserData] = useState({ name: '', email: '', mobile: '' });
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedMobile, setEditedMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/validuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setEditedName(data.name);
        setEditedEmail(data.email);
        setEditedMobile(data.mobile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEditedEmail(event.target.value);
  };

  const handleMobileChange = (event) => {
    setEditedMobile(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const saveUserData = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await fetch('https://isells-server.vercel.app/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          mobile: editedMobile,
          password: password,
        }),
      });
      // Optionally, you can update the local state with the saved data
      setUserData({
        ...userData,
        name: editedName,
        email: editedEmail,
        mobile: editedMobile,
      });
      // Clear the password fields after saving
      setPassword('');
      setConfirmPassword('');
      setError(''); // Clear the error if any
      setEditingName(false);
      setEditingEmail(false);
      setEditingMobile(false);
      setEditingPassword(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const cancelEdit = () => {
    // Reset edited values to current user data
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    setEditedMobile(userData.mobile);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setEditingName(false);
    setEditingEmail(false);
    setEditingMobile(false);
    setEditingPassword(false);
  };

  return (
    <div className="user_profile">
      <div className="details">
        <div className="user-icons">
          <AccountCircleIcon /><h4>Name</h4>
        </div>
        <p>{userData.name}
          {editingName ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={handleNameChange}
                placeholder="Edit Name"
              />
              <button onClick={saveUserData}>Save</button>
              <button onClick={() => setEditingName(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditingName(true)}>Edit</button>
          )}
        </p>
      </div>
      <div className="details">
        <div className="user-icons">
          <EmailIcon /><h4>Email</h4>
        </div>
        <p>{userData.email}
          {editingEmail ? (
            <>
              <input
                type="email"
                value={editedEmail}
                onChange={handleEmailChange}
                placeholder="Edit Email"
              />
              <button onClick={saveUserData}>Save</button>
              <button onClick={() => setEditingEmail(false)}>Cancel</button>
            </>
          ) : (
          <button onClick={() => setEditingEmail(true)}>Edit</button>
          )}
        </p>
      </div>
      <div className="details">
        <div className="user-icons">
          <CallIcon /><h4>Phone Number</h4>
        </div>
        <p>{userData.mobile}
          {editingMobile ? (
            <>
              <input
                type="text"
                value={editedMobile}
                onChange={handleMobileChange}
                placeholder="Edit Mobile"
              />
              <button onClick={saveUserData}>Save</button>
              <button onClick={() => setEditingMobile(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditingMobile(true)}>Edit</button>
          )}
        </p>
      </div>
      <div className="details">
        <div className="user-icons">
          <KeyIcon /><h4>Reset Password</h4>
        </div>
        <p>Password: 
          {editingPassword ? (
            <>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
              <button onClick={saveUserData}>Save</button>
              <button onClick={() => setEditingPassword(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditingPassword(true)}>Edit</button>
          )}
        </p>
        {editingPassword && (
        <>
          <p>Confirm Password:</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm Password"
          />
        </>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Settings;
