import React from 'react';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import './Contact.css'

const Contact = () => {
    return (     
        <div className='contact-page'>
            <section className='contact-container'>
                <section id='left-section' className='half-section'>
                    <div>
                        <h1>Welcome to Calgary's favourite billiards hall</h1>
                        <p>
                            We're not just a place to play pool - we're a community. Whether you're here to hone your skills,
                            compete in tournaments, or just have a fun night out, our doors are always open. With quality tables,
                            a welcoming atmosphere, and regular events, we offer the ultimate billiards experience in Calgary.
                            <br /> <br />
                            We are fully licensed and allow minors during all operational hours. Please see our{' '}
                            <Link to="/menu" className="menu-link">Menu</Link> page for all food and beverage options.
                            <br /> <br />
                            We have a resident cue tech that sells/repairs cues and will meet your cue maintenance needs.
                        </p>
                    </div>
                    <div className="hours-tables">
                        <div>
                            <h3>HOURS</h3>
                            <ul>
                                <li>7 days a week (11AM to 2AM)</li>
                                <li>365 days a year</li>
                                <li>Including every holiday</li>
                            </ul>
                        </div>
                        <div>
                            <h3>TABLES</h3>
                            <ul>
                                <li>Eight 7-foot Diamond tables</li>
                                <li>Six 7-foot Valley tables</li>
                                <li>Eight 9-foot Diamond tables</li>
                            </ul>
                        </div>
                    </div>
                    <div className="address-container">
                        <h3>ADDRESS</h3>
                        <p>3715 Edmonton Trail NE, Calgary, AB, T2E 3P3</p>

                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.2353179953684!2d-114.05533332340514!3d51.08566457172042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5371650b59d10d93%3A0xf13e461150efea6a!2s3715%20Edmonton%20Trl%2C%20Calgary%2C%20AB%20T2E%203P4!5e0!3m2!1sen!2sca!4v1733561185119!5m2!1sen!2sca" width="500" height="350" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" className='map'></iframe>
                        
                        {/* <a href="https://www.google.com/maps?q=3715+Edmonton+Trl,+Calgary,+AB+T2E+3P4" className="address_button" >Find us on Google Maps</a> */}

                    </div>
                </section>
                <section className="half-section">
                    <img src="/hall.webp" alt="Billiards hall" className='hall-image'/>

                    <h1>Have questions?</h1>
                    <p>Feel free to reach out by phone at <a href="tel:123-456-7890">123-456-7890</a>, or shoot us an email at <br/> <br/><a href="mailto:contact@hotshotbilliards.com">contact@hotshotbilliards.com</a></p>

                    <h1>Follow us on social media</h1>
                    <p>Become part of the community. Check us out on Instagram and Facebook <br/> <br/> <a href="https://www.facebook.com/">@hotshotbilliards</a>

                    </p>
                </section>
            </section>

        </div>
    );
}

export default Contact;
