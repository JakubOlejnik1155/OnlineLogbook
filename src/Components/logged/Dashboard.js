import React, { useContext, useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import DashboardHeader from './DashboardHeader';
import Menu from './Menu';
import '../../style/logged/Dashboard.scss';

const Dashboard =()=>{
    const Auth = useContext(AuthApi);
    //STATES WITH MENU TOGGLE
    const [state, setState] = React.useState({
        isMenuOpened: false,
    });

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
        <>
           <div className="Dashboard">
                <DashboardHeader
                    state={state}
                    setState={setState}/>
                <Menu
                    state={state}
                    setState={setState}/>
                <Switch>
                   <Route path="/dashboard" exact> <p style={{textAlign: 'center'}}>Dashboard</p> </Route>
                   <Route path="/dashboard/settings"> <p style={{ textAlign: 'center' }}>settings</p> </Route>
                </Switch>
           </div>
        </>
    )
};

export default Dashboard;