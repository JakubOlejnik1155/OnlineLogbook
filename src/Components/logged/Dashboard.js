import React, {useContext, useEffect} from "react";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import '../../style/logged/Dashboard.scss';
import connections from '../connections';

const Dashboard =()=>{
    const Auth = useContext(AuthApi);
    const logOutHandler = () => {
        deleteRefreshToken();
        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("RefreshToken");
        Cookies.remove("pp");
    };

    //deleting RT from DB
    const deleteRefreshToken = () => {
        const currentRefreshToken = Cookies.get("RefreshToken");
        const data = {
            RJwt: currentRefreshToken
        };
        const options ={
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(connections.authServer.concat("/api/user/logout"), options)
            .then(response =>{
                if (response.ok) return response;
                else throw Error(response.status.toString());
            })
            .catch(error => console.error(error))
    };
    //logout from dashboard
    const readCookie = () => {
        const userLoggedIn = Cookies.get("RefreshToken");
        if (userLoggedIn){
            Auth.setAuth(true);
        }else{
            Auth.setAuth(false);
        }
    };

    useEffect(()=>{
        readCookie();
    });
   return(
        <div>
           <div className="Dashboard">
                <header className="Dashboard__header DHeader">
                    <div className="DHeader__Logo">
                       {/* TODO: logo as link to main dashboard page */}
                        <img className="DHeader__image" src={Logo} alt="logo" />
                        <h1 className="DHeader__title">Online Logbook</h1>
                    </div>
                   {Cookies.get("pp") !== "undefined" && (<img className="DHeader__ProfilePicture" src={Cookies.get("pp")} alt="" />)}
                        <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
                </header>

           </div>
        </div>
    )
};


export default Dashboard;