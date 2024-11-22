import React from 'react'
import EmailIcon from '@mui/icons-material/Email';
import WifiCalling3Icon from '@mui/icons-material/WifiCalling3';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const ContactUs = () => {
  return (
    <>
       <div className="contactus-section">
            <div className="contact-us">
                <h4>ContactUs</h4>
                <img src="./images/iSells.in-login-image.png" alt="" />
                <div className="contact-items">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d437.3801565866319!2d77.06364523619418!3d28.718313139176153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d070cccbc51f1%3A0x7b13c1d4e20b8698!2sOrean%20Mobile%20%26%20Computer%20Accessories!5e0!3m2!1sen!2sin!4v1683181695281!5m2!1sen!2sin" 
                        width="1220" 
                        height="300" 
                        className="contact-map"
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
            <div className="contact-wrapper">
                <div className="contact-form">
                    <h6>Contact</h6>
                    <form>
                        <div className="contact-input">
                            <input type="text" className="form-control" placeholder="Name" />
                        </div>
                        <div className="contact-input">
                            <input type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="contact-input">
                            <input type="tel" className="form-control" placeholder="Number" />
                        </div>
                        <div>
                            <textarea name="" id="" className="w-90 form-control" cols="30" row="4 " placeholder="Comments"></textarea>
                        </div>
                        <div>
                            <button className="contact-button">Submit</button>
                        </div>
                    </form>
                </div>
                <div className="contact-form">
                    <h6>Contact</h6>
                    <div className="contact-details">
                        <div className="contact-icons">
                            <SupportAgentIcon />
                            <p>we provide 24/7 customer support</p>
                        </div>
                        <div className="contact-icons">
                            <WifiCalling3Icon />
                            <p>+91 9310127780</p>
                        </div>
                        <div className="contact-icons">
                            <EmailIcon />
                            <p>ashishtandon6@icloud.com</p>
                        </div>
                        <div className="contact-icons">
                            <AssuredWorkloadIcon />
                            <p>258, Ground Floor, Pocket 5, Sector 22, Rohini, North West Delhi, 110086, Delhi, India</p> 
                        </div>
                        <hr />
                        <TwitterIcon />
                        <FacebookIcon />
                        <InstagramIcon />
                        <YouTubeIcon />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ContactUs