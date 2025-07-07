import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UsersList.css'; // Optional: for styling
import { useNavigate } from 'react-router-dom';
function UsersList() {
  const [users, setUsers] = useState([]);
    const navigate=useNavigate();
  useEffect(() => {
    axios.get('http://localhost:3700/allusers')
      .then(res => {
        console.log("Users fetched:", res.data); // debug line
        setUsers(res.data);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);
  
  return (
    <div className="admin-users-container">
      <h2>Registered Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.mobile}</td>
              </tr>
            ))}
           <button onClick={()=>{navigate("/admin")}}>Back</button>
            
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersList;
