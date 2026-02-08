import React from 'react';
import Navigation from '../../components/Layout/Navigation';
import LandingSection from './components/LandingSection';
import './styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navigation />
      <LandingSection />
    </div>
  );
};

export default Home;
