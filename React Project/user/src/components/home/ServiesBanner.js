import React from 'react'

const ServiesBanner = () => {
  return (
    <div className="servies">
      <div className='servies_items'>
        <img src="images/service.png" alt="services" />
        <div className="hedding">
          <h6>Free Shipping</h6>
          <p>From All Orders Over $5</p>
        </div>
      </div>
      <div className='servies_items'>
        <img src="images/service-02.png" alt="services" />
        <div className="hedding">
          <h6>Daily Surprise Offers</h6>
          <p>Save Upto 25% Off</p>
        </div>
      </div>
      <div className='servies_items'>
        <img src="images/service-03.png" alt="services" />
        <div className="hedding">
          <h6>Support 24/7</h6>
          <p>Shop with an Expert</p>
        </div>
      </div>
      <div className='servies_items'>
        <img src="images/service-04.png" alt="services" />
        <div className="hedding">
          <h6>Affordable Prices</h6>
          <p>Grt Factory Default Price</p>
        </div>
      </div>
      <div className='servies_items'>
        <img src="images/service-05.png" alt="services" />
        <div className="hedding">
          <h6>Secure Payments</h6>
          <p>100% Protected Payments</p>
        </div>
      </div> 
    </div>              
  )
}

export default ServiesBanner