import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Orders from './Orders';
import Address from './Address';
import Payments from './Payments';
import Settings from './Settings';
import OrderHistory from './OrderHistory';
import SettingsIcon from '@mui/icons-material/Settings';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const MyAccount = () => {
    const [selectedItem, setSelectedItem] = useState('Orders'); // Default to 'Orders'
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://isells-server.vercel.app/validuser', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    const renderSelectedItem = () => {
        switch (selectedItem) {
            case 'Orders':
                return <Orders />;
            case 'Address':
                return <Address />;
            case 'Payments':
                return <Payments />;
            case 'Settings':
                return <Settings />;
            case 'OrderHistory':
                return <OrderHistory />;
            default:
                return <div>Select a category to view items</div>;
        }
    };

    return (
        <div className="myaccount-section">
            <div className="myaccount-sidebar">
                <div className="user-profile">
                    {user ? (
                        <Avatar
                            className='avtar2'
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            {user.name[0].toUpperCase()}
                        </Avatar>
                    ) : (
                        <Avatar
                            className='avtar'
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                    )}
                    <p>{user ? user.name : 'Loading...'}</p>
                </div>
                <p onClick={() => handleItemClick('Orders')}><AddShoppingCartIcon />Orders</p>
                <p onClick={() => handleItemClick('Address')}><AddLocationAltIcon />Address</p>
                <p onClick={() => handleItemClick('Payments')}><PaymentIcon />Payments</p>
                <p onClick={() => handleItemClick('Settings')}><SettingsIcon />Account Settings</p>
                <p onClick={() => handleItemClick('OrderHistory')}><SettingsIcon />OrderHistory</p>
            </div>
            <div className="myaccount-content">
                <div className="product_count">
                    {renderSelectedItem()}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
