import React, { useState, useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button } from '@mui/material';
import { NavLink } from "react-router-dom";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

const Slider = () => {
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setProducts(jsonData.products);
      } catch (error) {
        setError(error.message);
      } finally {
         setIsLoading(false);
      }
      };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="products_section">
      <div className="products_deal">
        <h3>New Products</h3>
      </div>
      <Carousel
        responsive={responsive}
        infinite={true}
        draggable={false}
        swipeable={true}
        showDots={false}
        centerMode={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        containerClass="carosel-container"
      >
        {products.map((e) => (
          <NavLink key={e._id} to={`/singleproduct/${e._id}`}>
            <div className="products_items">
              <div className="product_img">
                {e.images && e.images.length > 0 ? (
                  <img src={e.images[0]} alt="" />
                ) : (
                  <span>No Image Available</span>
                )}
              </div>
              <h6 className='products_name'>{e.modelName}</h6>
              <p className="products_offer">Rs.{e.price}.00</p>
              <div className='products_cartbutton'>
                <Button>add Cart</Button>
              </div>
            </div>
          </NavLink>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;
