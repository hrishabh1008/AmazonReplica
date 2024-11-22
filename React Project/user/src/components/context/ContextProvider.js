import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

const ContextProvider = ({ children }) => {
    const [account, setAccount] = useState(null); // Stores user account data
    const [cart, setCart] = useState([]); // Stores user's cart items

    // Function to update the cart
    const updateCart = (productId, quantity) => {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.productId === productId);
        
        // If item exists in cart, update its quantity
        if (itemIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                quantity: quantity
            };
            setCart(updatedCart);
        }
    };

    return (
        <LoginContext.Provider value={{ account, setAccount, cart, updateCart }}>
            {children}
        </LoginContext.Provider>
    );
};

export default ContextProvider;
