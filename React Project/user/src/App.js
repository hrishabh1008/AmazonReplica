import './App.css';
import {Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/header/Header';
import Navbar from './components/header/Navbar';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import Shop from './components/page/Shop';
import SingleProduct from './components/page/SingleProduct';
import SignIn from './components/page/SignIn';
import SignUp from './components/page/SignUp';
import Cart from './components/page/Cart';
import AboutUs from './components/page/AboutUs';
import ContactUs from './components/page/ContactUs';
import Terms from './components/page/Terms';
import Privacy from './components/page/Privacy';
import Help from './components/page/Help';
import MyAccount from './components/user/MyAccount';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [data,setData] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
      setData(true)
    },100)
  },[])

  return (
    <>
      {
        data ? (
          <>
            <Header />
            <Navbar />
            <Routes>
              <Route path="/"element={<Home />} />
              <Route path="/shop"element={<Shop />} />
              <Route path="/singleproduct/:_id"element={<SingleProduct />} />
              <Route path="/signin"element={<SignIn />} />
              <Route path="/signup"element={<SignUp />} />
              <Route path="/cart"element={<Cart />} />
              <Route path="/about"element={<AboutUs />} />
              <Route path="/contact"element={<ContactUs />} />
              <Route path="/privacy"element={<Privacy />} />
              <Route path="/terms"element={<Terms />} />
              <Route path="/help"element={<Help />} />
              <Route path="/myaccount"element={<MyAccount />} />
            </Routes>
            <Footer />
          </>
        ):
        (
          <div className='circle'>
            <CircularProgress />
            <h2>Lodding</h2>
          </div>
        )
      }  
    </>
  )
}

export default App;
