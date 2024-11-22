import React, { useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import { LoginContext } from '../context/ContextProvider';
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const NavbarMenu = ({logClose,logoutuser}) => {

    const { account, setAccount } = useContext(LoginContext);

  return (
    <>
        <div className="rightheader">
            <div className="right_nav">
                {
                    account ? <Avatar className='avtar2'>{account.name[0].toUpperCase()}</Avatar>:
                    <Avatar className='avtar'></Avatar>
                }

                {
                    account ? <h3>Hello, {account.name.toUpperCase()}</h3>:""
                }
            </div>
            <div className="nav_btn" onClick={()=>logClose()}>
                <NavLink to="/" style={{fontSize:13,fontWeight:600,marginRight:4}}>Home</NavLink>
                <NavLink to="/" style={{fontSize:13,fontWeight:600,marginRight:4}}>Shop By Category</NavLink>

                <Divider style={{width:"100%", marginLeft:"-20px"}} />

                <NavLink to="/" style={{fontSize:13,fontWeight:600,marginRight:4}}>Today's Deal</NavLink>

                {
                    account? <NavLink to="/cart" style={{fontSize:13,fontWeight:600,marginRight:4}}>Your Orders</NavLink>: <NavLink to="/signin" style={{fontSize:13,fontWeight:600,marginRight:4}}>Your Orders</NavLink>
                }

                <Divider style={{width:"100%", marginLeft:"-20px"}} />

                <div className="flag">
                    <SettingsIcon style={{fontSize:13,fontWeight:800,marginRight:4}} />
                    <NavLink to="/" style={{fontSize:13,fontWeight:600,marginRight:4,marginTop:20}} >Settings</NavLink>
                    <img src="" alt="" />
                </div>

                {
                    account ?
                    <div className="flag">
                        <LogoutIcon style={{fontSize:13,fontWeight:800,marginRight:4}} />
                        <h3 onClick={()=>logoutuser()} style={{cursor:"pointer",fontSize:13,fontWeight:600}}>Logout</h3>
                    </div>:
                    <NavLink to="/signin" style={{fontSize:13,fontWeight:600,marginRight:4}}>Login</NavLink>
                }

            </div>
        </div>
    </>
  )
}

export default NavbarMenu