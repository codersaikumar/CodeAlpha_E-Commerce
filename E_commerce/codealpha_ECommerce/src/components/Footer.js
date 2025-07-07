import React from 'react';
import './Footer.css'; // Optional for styling

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} E-Commerce Website | All Rights Reserved</p>
    </footer>
  );
}

export default Footer;
