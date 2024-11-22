import React, { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import Option from '../other/Option';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart data from server
  const fetchData = async () => {
    try {
      const res = await fetch('https://isells-server.vercel.app/cartdetails', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch cart data');
      }

      const userData = await res.json();

      if (userData && userData.carts) {
        const fetchedCartData = userData.carts.filter(cart => cart && typeof cart === 'object' && cart._id);
        setCartData(fetchedCartData);
      } else {
        setCartData([]);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      toast.error('Failed to fetch cart data. Please try again later.');
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal based on cart items
  const calculateSubtotal = () => {
    let total = 0;
    cartData.forEach(item => {
      if (item && item.price && item.quantity) {
        total += item.price * item.quantity;
      }
    });
    setSubtotal(total);
  };

  // Initiate payment via Paytm
  const initiatePayment = async () => {
    try {
      const response = await fetch('https://isells-server.vercel.app/paytm-initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: subtotal }), // Use the subtotal as the amount
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const paymentDetails = await response.json();
      console.log('Payment details:', paymentDetails);

      // Ensure all required fields are present in paymentDetails
      if (!paymentDetails || !paymentDetails.success || !paymentDetails.orderId || !paymentDetails.txnToken) {
        throw new Error('Invalid payment details received');
      }

      // Redirect to Paytm with paymentDetails.txnToken and other required parameters
      const paytmUrl = `https://securegw.paytm.in/theia/processTransaction?mid=${paymentDetails.MID}&orderId=${paymentDetails.orderId}&txnToken=${paymentDetails.txnToken}`;
      console.log('Redirecting to Paytm:', paytmUrl);
      window.location.href = paytmUrl;
    } catch (error) {
      console.error('Error initiating payment:', error.message);
      toast.error('Failed to initiate payment. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData(); // Fetch cart data on component mount
  }, []);

  useEffect(() => {
    calculateSubtotal(); // Recalculate subtotal when cartData changes
  }, [cartData]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="buynow_section">
          <div className="buynow_container">
            <div className="left_buy">
              <h1>Shopping Cart</h1>
              <p>Select all items</p>
              <span className="leftbuyprice">Price</span>
              <Divider />
              {cartData.map((item, index) => (
                item && item._id ? (
                  <React.Fragment key={item._id}>
                    <div className="item_containert">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt="Product" />
                      ) : (
                        <span>No Image Available</span>
                      )}
                      <div className="item_details">
                        <h4>Brand: {item.brand}</h4>
                        <h3>{item.modelName}</h3>
                        <h5 className="diffrentprice">{item.price}</h5>
                        <div className="option-quantity">
                          <h4>Quantity: {item.quantity}</h4>
                          <Option deletedata={item._id} get={fetchData} />
                        </div>
                      </div>
                      <h3 className="item_price">{(item.price * item.quantity).toFixed(2)}</h3>
                    </div>
                    <Divider />
                  </React.Fragment>
                ) : (
                  <React.Fragment key={index}>
                    <div className="item_containert">
                      <span>Item data is incomplete or missing.</span>
                    </div>
                    <Divider />
                  </React.Fragment>
                )
              ))}
              <div className="sub_item">
                <h3>Subtotal ({cartData.length} items): <strong style={{ fontWeight: 700, color: '#000000' }}>Rs.{subtotal.toFixed(2)}</strong></h3>
              </div>
            </div>
            <div className="right_buy">
              <img src="https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png" alt="rightimg" />
              <div className="cost_right">
                <p>Your Order is Eligible for Free Delivery.</p> <br />
                <span style={{ color: '#565959' }}>Select this option at Checkout. Details</span>
                <h3>Subtotal ({cartData.length} items): <span style={{ fontWeight: 700 }}>Rs.{subtotal.toFixed(2)}</span> </h3>
                <button className="rightbuy_btn" onClick={initiatePayment}>Checkout</button>
                <div className="emi">
                  EMI Available
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Cart;
