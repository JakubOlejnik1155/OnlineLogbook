import React, {useContext} from "react";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import '../../style/logged/Dashboard.scss'

const Dashboard =()=>{
    const Auth = useContext(AuthApi);
    const logOutHandler =() =>{
        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("userId");
    };
    return(
        <>
            <div className="Dashboard">


                <header className="Dashboard__header DHeader">
                    <div className="DHeader__Logo">
                        <img className="DHeader__image" src={Logo} alt="logo" />
                        <h1 className="DHeader__title">Online Logbook</h1>
                    </div>
                    <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
                </header>


            </div>
        </>
    )
};


export default Dashboard;

