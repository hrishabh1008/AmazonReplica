import React from 'react'
import Marquee from "react-fast-marquee";

const MarcueeWraper = () => {
  return (
    <div className="marquee-inner-wrapper">
        <Marquee className="brand-image">
        <div className="Brand mx-4 w-25"><img src="images/brand-01.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-02.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-03.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-04.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-05.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-06.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-07.png" alt="brand" /></div>
        <div className="Brand mx-4 w-25"><img src="images/brand-08.png" alt="brand" /></div>
        </Marquee>
    </div>
  )
}

export default MarcueeWraper