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
        e.preventDefault(); // Prevent default form submission behavior
    
        const { email, password } = logdata; // Assuming logdata contains form inputs
    
        try {
            // Make API call with Axios
            const res = await axios.post(
                'https://isells-server.vercel.app/signin', 
                { email, password }, // Payload
                { withCredentials: true } // Include cookies in the request
            );
    
            // Handle successful response
            const { user } = res.data; // Assuming the response includes a 'user' object
            setAccount(user); // Save user data to state
            toast.success('Sign in successful', { position: 'top-right' });
    
            // Redirect user after a small delay to ensure state is updated
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
    
        } catch (error) {
            // Handle errors
            console.error('Sign in error:', error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || 'Something went wrong', { position: 'top-right' });
        }
    };    
       
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
