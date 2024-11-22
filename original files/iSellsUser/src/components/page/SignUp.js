import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate(); // Access navigate function for navigation

  const [udata, setUdata] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: ""
  });

  const adddata = (e) => {
    const { name, value } = e.target;
    setUdata({
      ...udata,
      [name]: value
    });
  };

  const senddata = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, cpassword } = udata;

    try {
      const res = await fetch("https://isells-server.vercel.app/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, email, mobile, password, cpassword
        })
      });

      const data = await res.json();

      if (res.status === 422 || !data) {
        toast.warn("Invalid details", {
          position: "top-right",
        });
      } else {
        toast.success("Registration successful", {
          position: "top-right",
        });

        // Clear form data after successful registration
        setUdata({ name: "", email: "", mobile: "", password: "", cpassword: "" });

        // Redirect to login page using navigate function
        navigate('/signin');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        position: "top-right",
      });
    }
  };

  return (
    <section>
      <div className="signup_container">
        <div className="signup_header">
          <img src="./images/iSells.in-login-image.png" alt="amazonlogo" />
        </div>
        <div className="register_header">
          <div className="signup_form">
            <h1>Sign Up</h1>
            <form method='POST'>
              <div className="form_data">
                <label htmlFor="name">Name</label>
                <input type="text"
                  onChange={adddata}
                  value={udata.name}
                  name="name" id="name" />
              </div>
              <div className="form_data">
                <label htmlFor="email">Email</label>
                <input type="text"
                  onChange={adddata}
                  value={udata.email}
                  name="email" id="email" />
              </div>
              <div className="form_data">
                <label htmlFor="mobile">Mobile</label>
                <input type="text"
                  onChange={adddata}
                  value={udata.mobile}
                  name="mobile" id="mobile" />
              </div>
              <div className="form_data">
                <label htmlFor="password">Password</label>
                <input type="password"
                  onChange={adddata}
                  value={udata.password}
                  name="password" placeholder="At least 6 characters" id="password" />
              </div>
              <div className="form_data">
                <label htmlFor="password">Confirm Password</label>
                <input type="password"
                  onChange={adddata}
                  value={udata.cpassword}
                  name="cpassword" id="cpassword" />
              </div>
              <button className='signup_btn' onClick={senddata}>Continue</button>
              <div className="signup_info">
                <p>Already have an account?</p>
                <NavLink to="/signin">Sign In</NavLink>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default SignUp;
