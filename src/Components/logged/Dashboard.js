import React, {useContext, useEffect} from "react";
import {Link, Switch, Route} from 'react-router-dom';
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import DashboardHeader from './DashboardHeader';
import '../../style/logged/Dashboard.scss';

const Dashboard =()=>{
    const Auth = useContext(AuthApi);

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
            <DashboardHeader/>
                <Switch>
                   <Route path="/dashboard" exact component={LinkToSettings} />
                   <Route path="/dashboard/settings"  component={LinkToDash}/>
                </Switch>


           </div>
        </div>
    )
};

const LinkToSettings = () =>
    <Link to="/dashboard/settings"> Go to settings</Link>
const LinkToDash = () =>
    <Link to="/dashboard"> Go to dash</Link>


export default Dashboard;