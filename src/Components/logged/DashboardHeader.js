import React, {useContext} from 'react'
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import AuthApi from "../../authAPI";
import { Link } from 'react-router-dom';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import IconButton from '@material-ui/core/IconButton';
import UserProfilePicture from './Avatar';
import {deleteRefreshToken} from './RoutesComponents/constants/functions'


const DashBoardHeader = (props) => {

    const Auth = useContext(AuthApi);
    const logOutHandler = () => {
        deleteRefreshToken();
        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("RefreshToken");
        Cookies.remove("pp");
    };


    return (
        <header className="Dashboard__header DHeader">
            <div className="DHeader__Logo">
                <IconButton aria-label="menu" onClick={()=>props.setState({isMenuOpened: !props.state.isMenuOpened})}>
                    <MenuRoundedIcon color="primary" />
                </IconButton>
                <Link to="/dashboard" style={{ display: "flex" }}>
                    <img className="DHeader__image" src={Logo} alt="logo" />
                </Link>
                <h1 className="DHeader__title">Online Logbook</h1>
            </div>
            <UserProfilePicture />
            <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
        </header>
     );
}

export default DashBoardHeader;