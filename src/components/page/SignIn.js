import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/ContextProvider';
import axios from 'axios';

const SignIn = () => {
    const [logdata, setLogdata] = useState({
        email: "",
        password: ""
    });

    const { setAccount } = useContext(LoginContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLogdata({
            ...logdata,
            [name]: value
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior

    const { email, password } = logdata;

    try {
        // Make API call
        const res = await fetch("https://isells-server.vercel.app/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // Include cookies in the request
        });

        // Parse response data
        const responseData = await res.json();

        if (!res.ok) {
            // Handle errors from backend
            throw new Error(responseData.error || "Something went wrong");
        }

        // Handle successful sign-in
        setAccount(responseData.user); // Save user data to state
        toast.success("Sign in successful", { position: "top-right" });

        // Redirect user after a small delay to ensure the state is set
        setTimeout(() => {
            window.location.href = "/";
        }, 500);

    } catch (error) {
        // Handle fetch or response errors
        console.error("Sign in error:", error.message);
        toast.error(error.message, { position: "top-right" });
    }
};

// Function to check authentication status on page load
const checkAuth = async () => {
    try {
        const res = await fetch("https://isells-server.vercel.app/validuser", {
            method: "GET",
            credentials: 'include', // Include cookies in the request
        });

        if (res.status === 200) {
            const responseData = await res.json();
            setAccount(responseData); // Set authenticated user data
        } else {
            throw new Error('Authentication check failed');
        }
    } catch (error) {
        console.error("Auth check error:", error.message);
    }
};

// Call checkAuth on component mount or page load
useEffect(() => {
    checkAuth();
}, []);
        
       
    return (
        <section>
            <div className="sign_container">
                <div className="sign_header">
                    <img src="./images/iSells.in-login-image.png" alt="amazonlogo" />
                </div>
                <div className="sign_form">
                    <form onSubmit={handleSubmit}>
                        <h1>Sign-In</h1>
                        <div className="form_data">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                onChange={handleInputChange}
                                value={logdata.email}
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                onChange={handleInputChange}
                                value={logdata.password}
                                name="password"
                                placeholder="At least 6 characters"
                                id="password"
                            />
                        </div>
                        <button type="submit" className='signin_btn'>Continue</button>
                    </form>
                </div>
                <div className="create_accountinfo">
                    <p>Create Account iSells.in</p>
                    <NavLink to="/signup"><button>Create your account</button></NavLink>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default SignIn;
