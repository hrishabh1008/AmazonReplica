import React, { Suspense } from 'react';  // Import Suspense
import Carousel from 'react-material-ui-carousel';
import { Skeleton } from '@mui/material';

const data = [
    "/images/Fashion-Clothing.png",
    "/images/Hair-Accessories.png",
    "/images/mobile-accesories.png"  
];

const Banner = () => {
    return (
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} />}>
            <Carousel
                className="carousel"
                autoPlay={true}
                animation="slide"
                indicators={false}
                navButtonsAlwaysVisible={true}
                cycleNavigation={true}
                navButtonsProps={{
                    style: {
                        backgroundColor: "#ffffff",
                        color: "#494949",
                        marginTop: -22,
                    }
                }}
            >
                {data.map((image, i) => (
                    <img 
                        src={image} 
                        alt={`Banner ${i}`} 
                        className="banner_img" 
                        loading="lazy" 
                        key={i}
                    />
                ))}
            </Carousel>
        </Suspense>
    );
};

export default Banner;
