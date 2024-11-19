import React from 'react'
import { NavLink } from "react-router-dom"

const Help = () => {
  return (
    <>
        <div className="help-section">
            <div className="help">
                <div className="help-center">
                    <h4>Help Center</h4>
                    <p>Welcome to iSells.in! Our Help Center is designed to assist you with common questions and concerns. If you can't find the information you're looking for, feel free to contact our customer support team.</p>
                    <h4>Frequently Asked Questions (FAQs)</h4>
                    <div className="help-item">
                        <div className="help-items">
                            <h4>Ordering and Payments:</h4>
                            <p>How do I place an order?</p>
                            <p>What payment methods do you accept?</p>
                            <p>Can I modify or cancel my order?</p>
                        </div>
                        <div className="help-items">
                            <h4>Shipping and Delivery:</h4>
                            <p>What are your shipping options?</p>
                            <p>How can I track my order?</p>
                            <p>What do I do if my package is delayed?</p>
                        </div>
                        <div className="help-items">
                            <h4>Returns and Refunds:</h4>
                            <p>What is your return policy?</p>
                            <p>How do I initiate a return?</p>
                            <p>When will I receive my refund?</p>
                        </div>
                        <div className="help-items">
                            <h4>Account and Profile:</h4>
                            <p>How do I create an account?</p>
                            <p>How can I reset my password?</p>
                            <p>How do I update my account information?</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <div className="help-items">
                            <h4>2. Contact Us</h4>
                            <p>If your question is not covered in the FAQs, our customer support team is here to help.</p>
                            <p>Email: ashishtandon6@icloud.com</p>
                            <p>Phone: +91 9310127780</p>
                            <p>Live Chat: Click on the chat icon in the bottom right corner during business hours.</p>
                        </div>
                        <div className="help-items">
                            <h4>3. Privacy and Security</h4>
                            <p>Learn about how we handle your personal information and the security measures we have in place. Refer to our Privacy Policy.<NavLink to="/privacy">Privacy Policy.</NavLink></p>
                        </div>
                        <div className="help-items">
                            <h4>4. Terms and Conditions</h4>
                            <p>Review our Terms and Conditions<NavLink to="/terms">Terms and Conditions</NavLink> to understand the rules and regulations governing the use of our website.</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <div className="help-items">
                            <h4>5. Troubleshooting Tips</h4>
                            <p>Encounter an issue? Check out our troubleshooting tips for common problems.</p>
                            <p>Browser Compatibility</p>
                            <p>Login Issues</p>
                            <p>Payment Failures</p>
                        </div>
                        <div className="help-items">
                            <h4>5. Troubleshooting Tips</h4>
                            <p>Encounter an issue? Check out our troubleshooting tips for common problems.</p>
                            <p>Browser Compatibility</p>
                            <p>Login Issues</p>
                            <p>Payment Failures</p>
                        </div>
                        <div className="help-items">
                            <h4>6. Feedback</h4>
                            <p>We value your feedback! If you have suggestions or encounter any issues with our website, please let us know at ashishtandon6@icloud.com</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <div className="help-items">
                            <h4>5. Troubleshooting Tips</h4>
                            <p>Encounter an issue? Check out our troubleshooting tips for common problems.</p>
                            <p>Browser Compatibility</p>
                            <p>Login Issues</p>
                            <p>Payment Failures</p>
                        </div>
                        <div className="help-items">
                            <h4>6. Feedback</h4>
                            <p>We value your feedback! If you have suggestions or encounter any issues with our website, please let us know at ashishtandon6@icloud.com</p>
                        </div>
                        <div className="help-items">
                            <h4>7. Hours of Operation</h4>
                            <p>Our customer support is available during the following 24/7 hours,
                            Thank you for choosing iSells.in! We appreciate your business and are committed to providing you with an excellent shopping experience.
                            Last Updated: 19/11/2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Help