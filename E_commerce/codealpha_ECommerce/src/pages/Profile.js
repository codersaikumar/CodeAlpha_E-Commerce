import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-card">
        <img
          src={'images.png'}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;