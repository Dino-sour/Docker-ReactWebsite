import React, {useState } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
    const images = [
        '/pic1.png',
        '/pic2.png',
        '/pic3.jpeg',
        '/pic4.jpg',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex - 2 + images.length) % images.length
        );
    };

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-overlay">
            <h1>
              Step into a world of classic entertainment and friendly
              competition
            </h1>
            <button className="primary-button"><Link to="/events">View events</Link></button>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <h2>Join our thrilling tournaments and league games</h2>
            <p>
              At Billiards Club, we believe that every shot tells a story.
              Whether you're a seasoned pro or a passionate newcomer, our
              tournaments and league games offer the perfect stage for your
              skills to shine.
            </p>
            <div className="learn-more-button">
              <button className="secondary-button"><Link to="/leagues/registration">Learn more</Link></button>
            </div>
          </div>

          <div className="feature">
            <h2>More than just a pool hall</h2>
            <p>
              Whether you're bringing the family for lunch, meeting friends for
              a fun night out, or hosting colleagues for some team building,
              come share in our passion for the sport. Enjoy our lively
              atmosphere, featuring three large fish tanks, great background
              music, and a jukebox to set the perfect mood for your game.
            </p>
            <div className="about-us-button">
              <button className="secondary-button"><Link to="/about/contact">About Us</Link></button>
            </div>
          </div>
        </section>
        
        <section className="gallery">
            <h2>Photo Gallery</h2>
            <div className="carousel">
                <button className="gallery-nav" onClick={handlePrev}>❮</button>
                <div className="gallery-container">
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="carousel-image"
                    />
                    <img
                        src={images[(currentIndex + 1) % images.length]}
                        alt={`Image ${(currentIndex + 2)}`}
                        className="carousel-image"
                    />
                </div>
                <button className="gallery-nav" onClick={handleNext}>❯</button>
            </div>
        </section>
        
      </main>
    </>
  );
};

export default Home;
