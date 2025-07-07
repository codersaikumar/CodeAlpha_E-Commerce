import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to QuickKart 🛒</h1>
        <p>Your one-stop shop for everything you need</p>
        <a  className="shop-now-button">Shop Now</a>
      </div>
    </div>
  );
}

export default Home;
