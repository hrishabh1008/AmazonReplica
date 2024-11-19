import React, { useEffect, useContext, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import NavbarMenu from './NavbarMenu';
import { NavLink, useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoginContext } from '../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';

const Header = () => {
    const { account, setAccount } = useContext(LoginContext);
    const history = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [text, setText] = useState("");
    const [dropen, setDropen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getDetailValidUser = async () => {
        try {
            const res = await fetch("https://isells-server.vercel.app/validuser", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (res.ok) {
                const data = await res.json();
                setAccount(data);
            } else {
                console.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleOpen = () => {
        setDropen(true);
    };

    const handleCloseDrawer = () => {
        setDropen(false);
    };

    const logoutUser = async () => {
        try {
            const res2 = await fetch("https://isells-server.vercel.app//logout", {  // Endpoint now correctly matches the backend route
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"  // Ensure the cookie is included in the request
            });
    
            const data2 = await res2.json();
            if (res2.status !== 200) {  // Ensure you're checking for status 200 (success)
                console.error("Logout failed:", data2);
                toast.error("Logout failed. Please try again.");
            } else {
                setAccount(null);  // Clear account state in frontend
                toast.success("Logout successful", {
                    position: "top-right"
                });
                history("/");  // Redirect to homepage or login page
            }
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Error during logout. Please try again.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        history(`/shop?search=${text}`);
    };

    useEffect(() => {
        getDetailValidUser();
    }, []);

    return (
        <div className="header_section">
            <div className="header_logo">
                <IconButton className='hamburgur' onClick={handleOpen}>
                    <MenuIcon style={{ color: "#fff" }} />
                </IconButton>
                <Drawer open={dropen} onClose={handleCloseDrawer}>
                    <NavbarMenu logClose={handleCloseDrawer} logoutUser={logoutUser} />
                </Drawer>
                <div className="header_img">
                    <NavLink to="/">
                        <img src="/images/iSells.in-online-store.png" alt="iSells.in Online Store" />
                    </NavLink>
                </div>
            </div>
            <div className="header_searchbar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Search...'
                        value={text}
                    />
                    <div className="search_icon" onClick={handleSearch}>
                        <SearchIcon id="search" />
                    </div>
                </form>
            </div>
            <div className="header_user">
                <div className="header_login">
                    {account ? (
                        <NavLink to="/myaccount">My Account</NavLink>
                    ) : (
                        <NavLink to="/signin">Login / Register</NavLink>
                    )}
                </div>
                <div className="cart_icon">
                    {account ? (
                        <NavLink to="/cart">
                            <Badge badgeContent={account.carts.length} color="primary">
                                <ShoppingCartIcon id="icon" />
                            </Badge>
                        </NavLink>
                    ) : (
                        <NavLink to="/signin">
                            <Badge badgeContent={0} color="primary">
                                <ShoppingCartIcon id="icon" />
                            </Badge>
                        </NavLink>
                    )}
                    <ToastContainer />
                    <p>Cart</p>
                </div>
                {account ? (
                    <Avatar className='avatar2'
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >{account.name[0].toUpperCase()}</Avatar>
                ) : (
                    <Avatar className='avatar'
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    ></Avatar>
                )}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {account ? (
                        <MenuItem style={{ fontSize: 13, marginRight: 3 }} onClick={() => { handleClose(); history("/myaccount"); }}>
                            My Account
                        </MenuItem>
                    ) : (
                        <MenuItem style={{ fontSize: 13, marginRight: 3 }} onClick={() => { handleClose(); history("/signin"); }}>
                            My Account
                        </MenuItem>
                    )}
                    {account ? (
                        <MenuItem style={{ fontSize: 12, fontWeight: 500, marginRight: 3 }} onClick={() => { handleClose(); logoutUser(); }}>
                            <LogoutIcon style={{ fontSize: 13, fontWeight: 800, marginRight: 3 }} />Log Out
                        </MenuItem>
                    ) : ""}
                </Menu>
            </div>
        </div>
    );
}

export default Header;
