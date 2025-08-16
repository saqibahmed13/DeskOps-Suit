import React from 'react';
import Header from './Header';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="about-container">
            <h1>Welcome to DeskOps Suits</h1>
            <p className="about-hero-lead">
              Smart, modular, and elegant workspace solutions that evolve with you.
            </p>
          </div>
        </section>

        {/* Mission / Vision Section */}
        <section className="about-mission-vision-section">
          <div className="about-container about-cards-row">
            <div className="about-info-card">
              <h4 className="about-icon-title about-mission">🎯 Our Mission</h4>
              <p>
                We aim to create inspiring, ergonomic, and technology-friendly workspaces that enhance productivity while embracing sustainability and innovation.
              </p>
            </div>
            <div className="about-info-card">
              <h4 className="about-icon-title about-vision">🚀 Our Vision</h4>
              <p>
                To become a leader in smart office design with AI-enabled planning tools, eco-conscious materials, and intuitive modular components for every workspace.
              </p>
            </div>
          </div>
        </section>

        {/* Product Highlights */}
        <section className="about-highlights-section">
          <div className="about-container">
            <h2>🛠️ Product Highlights</h2>
            <div className="about-cards-row about-highlights-row">
              <div className="about-highlight-card">
                <h5>Modular Systems</h5>
                <p>Desks, partitions &amp; full systems tailored to every office need.</p>
              </div>
              <div className="about-highlight-card">
                <h5>Smart Storage</h5>
                <p>Wood or metal-based pedestals, lockers, credenzas and tall partitions.</p>
              </div>
              <div className="about-highlight-card">
                <h5>Power Integration</h5>
                <p>Seamlessly embedded power/data modules with CAD-based layout support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="about-footer-cta">
          <div className="about-container">
            <h3>Ready to elevate your workspace?</h3>
            <button className="about-cta-btn">Contact Us</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
