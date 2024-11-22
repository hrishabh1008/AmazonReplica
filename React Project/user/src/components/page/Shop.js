import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: 0, max: null });
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState('All');
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState('All');
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setProducts(jsonData.products);

                const allCategories = jsonData.products.map(product => product.category);
                const allColors = jsonData.products.map(product => product.color);
                const allSizes = jsonData.products.map(product => product.size);

                setCategories(['All', ...new Set(allCategories)]);
                setColors(['All', ...new Set(allColors)]);
                setSizes(['All', ...new Set(allSizes)]);

                const sortedByRating = [...jsonData.products].sort((a, b) => b.rating - a.rating);
                setTopRatedProducts(sortedByRating.slice(0, 2));
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page')) || 1;
        const category = decodeURIComponent(searchParams.get('category') || 'All');
        const search = searchParams.get('search') || '';

        setCurrentPage(page);
        setSelectedCategory(category);
        setSearchTerm(search);
    }, [location.search]);

    const paginate = (event, pageNumber) => {
        navigate(`?page=${pageNumber}&category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchTerm)}`);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
        navigate(`?page=1&category=${encodeURIComponent(event.target.value)}&search=${encodeURIComponent(searchTerm)}`);
    };

    const handlePriceRangeChange = (event) => {
        const { name, value } = event.target;
        setPriceRange(prevState => ({
            ...prevState,
            [name]: value === '' ? null : Number(value)
        }));
        setCurrentPage(1);
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
        setCurrentPage(1);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredProducts = products.filter(product => {
        const inCategory = selectedCategory === 'All' || product.category.includes(selectedCategory);
        const inPriceRange = product.price >= priceRange.min && (priceRange.max === null || product.price <= priceRange.max);
        const inColor = selectedColor === 'All' || product.color === selectedColor;
        const inSize = selectedSize === 'All' || product.size === selectedSize;
        const inSearchTerm = product.modelName.toLowerCase().includes(searchTerm.toLowerCase());
        return inCategory && inPriceRange && inColor && inSize && inSearchTerm;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const renderProducts = () => (
        <div className="product-row">
            {currentProducts.map((product) => (
                <div className="productcard_items" key={product._id}>
                    <div className="productcard_img">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.modelName} />
                        ) : (
                            <span>No Image Available</span>
                        )}
                    </div>
                    <h6 className="productcard_name">{product.modelName}</h6>
                    <p className="productcard_offer">Rs. {product.price}.00</p>
                    <div className="productcard_cartbutton">
                        <NavLink to={`/singleproduct/${product._id}`} style={{ textDecoration: 'none' }}>
                            <Button>Add Cart</Button>
                        </NavLink>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTopRatedProducts = () => (
        <div className="top-rated-products">
            <h4>Top Rated Products</h4>
            {topRatedProducts.map(product => (
                <div className="top-rated-product-item" key={product._id}>
                    <div className="productcards_img">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.modelName} />
                        ) : (
                            <span>No Image Available</span>
                        )}
                    </div>
                    <div className="productscards_details">
                        <h6 className="productcards_name">{product.modelName}</h6>
                        <p className="productcards_offer">Rs. {product.price}.00</p>
                        <div className="productcards_cartbuttons">
                            <NavLink to={`/singleproduct/${product._id}`} style={{ textDecoration: 'none' }}>
                                <Button>Add Cart</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="shop-section">
            <div className="side-bar">
                <h4>Categories</h4>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <h4>Price Range</h4>
                <div>
                    <label>
                        Min Price:
                        <input
                            type="number"
                            name="min"
                            value={priceRange.min}
                            onChange={handlePriceRangeChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Max Price:
                        <input
                            type="number"
                            name="max"
                            value={priceRange.max === null ? '' : priceRange.max}
                            onChange={handlePriceRangeChange}
                        />
                    </label>
                </div>
                <h4>Colors</h4>
                <select value={selectedColor} onChange={handleColorChange}>
                    {colors.map((color, index) => (
                        <option key={index} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
                <h4>Sizes</h4>
                <select value={selectedSize} onChange={handleSizeChange}>
                    {sizes.map((size, index) => (
                        <option key={index} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <h4>Search</h4>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products"
                />
                <div className="top_rated">
                    {renderTopRatedProducts()}
                </div>
            </div>
            <div className="shop">
                <div className="product_count">
                    <p>Products on this page: {currentProducts.length} </p>
                    <p>Total Products: {filteredProducts.length} </p>
                    <div className="lines">
                        <hr />
                    </div>
                </div>
                <div className="shop-products">
                    <div className="productcard_section">
                        {renderProducts()}
                    </div>
                </div>
                <hr />
                <div className="pagination">
                    <p>Page {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}</p>
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(filteredProducts.length / productsPerPage)}
                            page={currentPage}
                            onChange={paginate}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={NavLink}
                                    to={`?page=${item.page}&category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchTerm)}`}
                                    {...item}
                                />
                            )}
                        />
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default Shop;
