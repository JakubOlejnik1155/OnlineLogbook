import React, {useContext, useEffect} from "react";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import '../../style/logged/Dashboard.scss';
import {Switch, Route} from 'react-router-dom'
import Settings from "./Settings";
import ExampleOne from "./ExampleOne";
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
        <>
            <div className="Dashboard">
                <header className="Dashboard__header DHeader">
                    <div className="DHeader__Logo">
                        <img className="DHeader__image" src={Logo} alt="logo" />
                        <h1 className="DHeader__title">Online Logbook</h1>
                    </div>
                    <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
                </header>
                <Switch>
                    <Route path="/dashboard" exact component={ExampleOne}/>
                    <Route path="/dashboard/settings" exact component={Settings}/>
                </Switch>
            </div>
        </>
    )
};


export default Dashboard;