import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Skin-Care', image: '/images/Skin-Care.png' },
  { name: 'Makeup', image: '/images/Makeup.png' },
  { name: 'Hair-Care', image: '/images/Hair-Care.png' },
  { name: 'Fragrances', image: '/images/Fragrances.png' },
  // Add more categories as needed
];

const CategoryBeauty = () => {
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

export default CategoryBeauty;
