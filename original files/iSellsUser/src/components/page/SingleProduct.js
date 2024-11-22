import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { LoginContext } from '../context/ContextProvider';
import ReactStars from "react-rating-stars-component";
import { Divider, Button, TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SingleProduct = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const { setAccount, updateCart, userOrders } = useContext(LoginContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ stars: 0, comment: '' });
    const [mainImage, setMainImage] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://isells-server.vercel.app/singleproduct/${_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await res.json();
                setProduct(data);
                setMainImage(data.images[0]);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError('Failed to fetch product');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [_id]);

    const addtocart = async (productId) => {
        try {
            const res = await fetch(`https://isells-server.vercel.app/addcart/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: productId, quantity }),
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to add to cart");
            }

            const data = await res.json();
            navigate("/cart");
            setAccount(data);
            updateCart(productId, quantity);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increment' && quantity < 10) {
            setQuantity(quantity + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const res = await fetch(`https://isells-server.vercel.app/addreview/${_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newReview),
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to submit review");
            }

            const data = await res.json();
            setProduct(data);
            setShowReviewForm(false);
            setNewReview({ stars: 0, comment: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to submit review");
        }
    };

    const calculateAverageStars = (reviews) => {
        if (reviews && reviews.length > 0) {
            let totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
            return totalStars / reviews.length;
        } else {
            return 0;
        }
    }

    const calculateOverallRating = () => {
        if (product && product.reviews && product.reviews.length > 0) {
            let totalStars = product.reviews.reduce((acc, review) => acc + review.stars, 0);
            let averageStars = totalStars / product.reviews.length;
            return averageStars.toFixed(1);
        } else {
            return "No reviews yet";
        }
    }

    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    const canAddReview = () => {
        return !!userOrders && userOrders.length > 0 && !!userOrders.find(order => order.productId === product._id);
    };

    if (loading) {
        return (
            <div className='circle'>
                <CircularProgress />
                <h2>Loading</h2>
            </div>
        );
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="cart_section">
            <div className="cart_container">
                <div className="left_cart">
                    <div className="products-images">
                        <img src={mainImage} alt="Product" style={{ width: "100%", cursor: "zoom-in" }} />
                    </div>
                    <div className="other-images">
                        <div className="mor-images">
                            {product.images.map((image, index) => (
                                <div className="images" key={index}>
                                    <img
                                        src={image}
                                        alt="Product"
                                        onClick={() => handleImageClick(image)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="right_cart">
                    <h3>Brand: {product.brand}</h3>
                    <h4>{product.modelName}</h4>
                    <div className="review">
                        <ReactStars count={5} size={24} value={calculateAverageStars(product.reviews || [])} edit={false} activeColor="#ffd700" />
                        <p className="review">{(product.reviews && product.reviews.length) || 0} Reviews</p>
                        <p>Rating: {calculateOverallRating()}</p>
                    </div>
                    <p className="mrp">Price: Rs.<strike style={{ color: "#565959" }}> {product.mrp}</strike> <span className="red-p">{product.price}.00</span> &nbsp;</p>
                    <p> You Save: <span style={{ color: "#B12704" }}>Rs. {product.mrp - product.price}.00</span></p>
                    <div className='discount_box'>
                        <h4>Free Delivery: <span style={{ color: "#111,fontWeight:600" }}>{product.tagline}</span></h4>
                        <h3>7 Days Replacement Policy</h3>
                    </div>
                    <div className="product-quantity">
                        <h6>Model Number: {product.modelNumber}</h6>
                    </div>
                    <div className="product-quantity">
                        <h6>Color: {product.color}</h6>
                    </div>
                    <div className="product-quantity">
                        <h6>Sales Package: {product.salesPackage}</h6>
                    </div>
                    <div className="product-quantity">
                        <h6>Available Stock: {product.quantity}</h6>
                    </div>
                    <div className="addquantity-btn">
                        <h6>Quantity:</h6>
                        <div className="add-quantity">
                            <button onClick={() => handleQuantityChange('decrement')}>-</button>
                            <input
                                type="number"
                                name="quantity"
                                min={1}
                                max={10}
                                className="form-control"
                                style={{ width: "40px", height: "16px", margin: "10px" }}
                                value={quantity}
                                readOnly
                            />
                            <button onClick={() => handleQuantityChange('increment')}>+</button>
                        </div>
                        <div className="addcart-buynow">
                            <button className="button border-0" onClick={() => addtocart(product._id)} type="submit">Add Cart</button>
                        </div>
                    </div>
                    <Divider />
                    <br />
                    {canAddReview() && (
                        <Button variant="contained" color="primary" onClick={() => setShowReviewForm(true)}>Add Review</Button>
                    )}
                </div>
            </div>
            <div className="description_container">
                <div className="specification">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            Specification
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="conntent">
                                <h4>Color:</h4>
                                <p>{product.color}</p>
                            </div>
                            <div className="conntent">
                                <h4>Sales Package:</h4>
                                <p>{product.salesPackage}</p>
                            </div>
                            <div className="conntent">
                                <h4>Model Number:</h4>
                                <p>{product.modelNumber}</p>
                            </div>
                            <div className="conntent">
                                <h4>Model Name:</h4>
                                <p>{product.modelName}</p>
                            </div>
                            <div className="conntent">
                                <h4>Product Dimensions:</h4>
                                <p>{product.dimensions}</p>
                            </div>
                            <div className="conntent">
                                <h4>Build Material:</h4>
                                <p>{product.buildMaterial}</p>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className="products-description">
                    <h6>Products Description</h6>
                    <p>Product Description: <span>{product?.description}</span></p>
                </div>
            </div>
            <div className="reviews_container">
                <div className="product-reviews">
                    <h4>Customer Reviews</h4>
                    {showReviewForm && (
                        <div className="review-form">
                            <h5>Add Your Review</h5>
                            <ReactStars count={5} onChange={(newValue) => setNewReview({ ...newReview, stars: newValue })} activeColor="#ffd700" />
                            <TextField
                                label="Comment"
                                multiline
                                rows={4}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <div>
                                <Button variant="contained" color="primary" onClick={handleReviewSubmit}>Submit Review</Button>
                                <Button variant="contained" color="secondary" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                            </div>
                        </div>
                    )}
                    <div className="review-comments">
                        {(showAllReviews ? product.reviews : product.reviews.slice(0, 2)).map((review, index) => (
                            <div key={index} className="review-comment">
                                <ReactStars count={5} size={24} value={review.stars} edit={false} activeColor="#ffd700" />
                                <p>{review.comment}</p>
                            </div>
                        ))}
                        {product.reviews.length > 2 && (
                            <Button variant="outlined" color="primary" onClick={() => setShowAllReviews(!showAllReviews)}>
                                {showAllReviews ? "Less Reviews" : "All Reviews"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;
