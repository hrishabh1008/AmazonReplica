import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'fashion-accessories', image: '/images/fashion-accessories.png' },
  { name: 'Womens-Clothings', image: '/images/Womens-Clothings.png' },
  { name: 'Mens-Clothings', image: '/images/Mens-Clothings.png' },
  { name: 'hair-accessories', image: '/images/Kids-Accessories.png' },
  // Add more categories as needed
];

const CategoryClothing = () => {
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

export default CategoryClothing;
