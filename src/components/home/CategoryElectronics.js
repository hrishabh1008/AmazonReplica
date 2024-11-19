import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Speakers', image: '/images/Speakers.png' },
  { name: 'Home-Appliances', image: '/images/kitchenware.png' },
  { name: 'Mobile-Accessories', image: '/images/MobileAccessories.png' },
  { name: 'Computer-Accessories', image: '/images/Computer-Accessories.png' },
  // Add more categories as needed
];

const CategoryElectronics = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <div className="category-wrapper">
        {categories.map((category) => (
          <div className="wrapper-items" key={category.name} onClick={() => handleCategoryClick(category.name)}>
            <img src={category.image} alt={category.name} />
            <h6>{category.name}</h6>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryElectronics;
