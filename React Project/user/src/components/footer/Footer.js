import React from 'react';
import { NavLink } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer>
            <div className="footer_container">
                <div className="footer_details_one">
                    <h3>Contact Details</h3>
                    <p>Home</p>
                    <p>+91 9310127780</p>
                    <p>ashishtandon6@icloud.com</p>
                    <TwitterIcon />
                    <FacebookIcon />
                    <InstagramIcon />
                    <YouTubeIcon />
                </div>
                <div className="footer_details_one">
                    <h3>Get to Know Us</h3>
                    <p><NavLink to="/about">About Us</NavLink></p>
                    <p><NavLink to="/contact">Contact Us</NavLink></p>
                    <p><NavLink to="/privacy">Privacy & Policy</NavLink></p>
                    <p><NavLink to="/terms">Terms & Conditions</NavLink></p>
                </div>
                <div className="footer_details_one forres">
                    <h3>Get to Know Us</h3>
                    <p><NavLink to="/return">Return Policy</NavLink></p>
                    <p><NavLink to="/refund">Refund Policy</NavLink></p>
                    <p><NavLink to="/shipping ">Shipping Policy</NavLink></p>
                    <p><NavLink to="/payment">Payment Policy</NavLink></p>
                </div>
                <div className="footer_details_one forres">
                    <h3>Products Categories</h3>
                    <p><NavLink to="/electronics">Electronics</NavLink></p>
                    <p><NavLink to="/kitchen">Home & Kitchen</NavLink></p>
                    <p><NavLink to="/clothing">Fashion & Clothing</NavLink></p>
                    <p><NavLink to="/accessories">Kids Accessories</NavLink></p>
                </div>
            </div>
            <div className="lastdetails">
                <img src="/images/iSells.in-footer.png" alt="iSells.in Footer Logo" />
                <p>Conditions of Use & Sale &nbsp; Privacy Notice &nbsp; iSells.in &copy; Copyright 2022-{year}</p>
            </div>
        </footer>
    );
}

export default Footer;
