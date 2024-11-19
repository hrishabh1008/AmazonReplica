import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Navbar = () => {
  const navigate = useNavigate();
  const [showElectronicsMenu, setShowElectronicsMenu] = useState(false);
  const [showHomeKitchenMenu, setShowHomeKitchenMenu] = useState(false);
  const [showFashionClothingMenu, setShowFashionClothingMenu] = useState(false);
  const [showBeautyProductsMenu, setShowBeautyProductsMenu] = useState(false);

  const navbarRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      // Clicked outside the navbar
      setShowElectronicsMenu(false);
      setShowHomeKitchenMenu(false);
      setShowFashionClothingMenu(false);
      setShowBeautyProductsMenu(false);
    }
  };

  const toggleElectronicsMenu = () => {
    setShowElectronicsMenu(!showElectronicsMenu);
    setShowHomeKitchenMenu(false);
    setShowFashionClothingMenu(false);
    setShowBeautyProductsMenu(false);
  };

  const toggleHomeKitchenMenu = () => {
    setShowElectronicsMenu(false);
    setShowHomeKitchenMenu(!showHomeKitchenMenu);
    setShowFashionClothingMenu(false);
    setShowBeautyProductsMenu(false);
  };

  const toggleFashionClothingMenu = () => {
    setShowElectronicsMenu(false);
    setShowHomeKitchenMenu(false);
    setShowFashionClothingMenu(!showFashionClothingMenu);
    setShowBeautyProductsMenu(false);
  };

  const toggleBeautyProductsMenu = () => {
    setShowElectronicsMenu(false);
    setShowHomeKitchenMenu(false);
    setShowFashionClothingMenu(false);
    setShowBeautyProductsMenu(!showBeautyProductsMenu);
  };

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const preventPropagation = (event) => {
    event.stopPropagation();
    setShowElectronicsMenu(false);
    setShowHomeKitchenMenu(false);
    setShowFashionClothingMenu(false);
    setShowBeautyProductsMenu(false);
  };

  return (
    <div className="navbar" ref={navbarRef}>
      <div className="navbar_details">
        <NavLink to="/" exact className="home-link" onClick={preventPropagation}>
          <HomeIcon />
          <p>Home</p>
        </NavLink>
        <p><NavLink to="/shop" onClick={preventPropagation}>Shop</NavLink></p>
        <div className="category" onClick={toggleElectronicsMenu}>
          {showElectronicsMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <p>Electronics</p>
        </div>
        {showElectronicsMenu && (
          <div className="submenu">
            <p onClick={() => handleCategoryClick('Mobiles-Phones')}>Mobiles Phones</p>
            <p onClick={() => handleCategoryClick('Computer-Laptops')}>Computer & Laptops</p>
            <p onClick={() => handleCategoryClick('Mobile-Accessories')}>Mobile Accessories</p>
            <p onClick={() => handleCategoryClick('Computer-Accessories')}>Computer Accessories</p>
            <p onClick={() => handleCategoryClick('Speakers')}>Speakers</p>
            <p onClick={() => handleCategoryClick('Home-Appliances')}>Home Appliances</p>
          </div>
        )}
        <div className="category" onClick={toggleHomeKitchenMenu}>
          {showHomeKitchenMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <p>Home & Kitchen</p>
        </div>
        {showHomeKitchenMenu && (
          <div className="submenu">
            <p onClick={() => handleCategoryClick('Home-Appliances')}>Home Appliances</p>
            <p onClick={() => handleCategoryClick('Cookware')}>Cookware</p>
            <p onClick={() => handleCategoryClick('Home-Decor')}>Home Decor</p>
            <p onClick={() => handleCategoryClick('Furniture')}>Furniture</p>
            <p onClick={() => handleCategoryClick('Bedding')}>Bedding</p>
          </div>
        )}
        <div className="category" onClick={toggleFashionClothingMenu}>
          {showFashionClothingMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <p>Fashion & Clothing</p>
        </div>
        {showFashionClothingMenu && (
          <div className="submenu">
            <p onClick={() => handleCategoryClick('Mens-Clothings')}>Mens Clothings</p>
            <p onClick={() => handleCategoryClick('Womens-Clothings')}>Womens Clothings</p>
            <p onClick={() => handleCategoryClick('Kids-Clothings')}>Kids Clothings</p>
            <p onClick={() => handleCategoryClick('Footwear')}>Footwear</p>
            <p onClick={() => handleCategoryClick('Hair-Accessories')}>Hair Accessories</p>
            <p onClick={() => handleCategoryClick('Fashion-Accessories')}>Fashion Accessories</p>
          </div>
        )}
        <div className="category" onClick={toggleBeautyProductsMenu}>
          {showBeautyProductsMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <p>Beauty Products</p>
        </div>
        {showBeautyProductsMenu && (
          <div className="submenu">
            <p onClick={() => handleCategoryClick('Skin-Care')}>Skin Care</p>
            <p onClick={() => handleCategoryClick('Makeup')}>Makeup</p>
            <p onClick={() => handleCategoryClick('Hair-Care')}>Hair Care</p>
            <p onClick={() => handleCategoryClick('Fragrances')}>Fragrances</p>
            <p onClick={() => handleCategoryClick('Personal-Care')}>Personal Care</p>
          </div>
        )}
        <p><NavLink to="/about" onClick={preventPropagation}>About Us</NavLink></p>
        <p><NavLink to="/contact" onClick={preventPropagation}>Contact Us</NavLink></p>
        <p><NavLink to="/help" onClick={preventPropagation}>Help</NavLink></p>
      </div>
    </div>
  );
};

export default Navbar;
