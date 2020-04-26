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
    //check if user login
    useEffect(()=>{
        readCookie();
    });

    const Routes = () => (
        <Switch>
            <Route path="/dashboard" exact> <p style={{ textAlign: 'center' }}>Dashboard</p> </Route>
            <Route path="/dashboard/start/cruise" exact> <p style={{ textAlign: 'center' }}>Start Cruise</p> </Route>
            <Route path="/dashboard/start/day" exact> <p style={{ textAlign: 'center' }}>Start Day</p> </Route>
            <Route path="/dashboard/add" exact> <p style={{ textAlign: 'center' }}>add log entry</p> </Route>
            <Route path="/dashboard/add/weather" exact> <p style={{ textAlign: 'center' }}>Add weather</p> </Route>
            <Route path="/dashboard/add/action" exact> <p style={{ textAlign: 'center' }}>Add action</p> </Route>
            <Route path="/dashboard/finish/cruise" exact> <p style={{ textAlign: 'center' }}>Finish cruise</p> </Route>
            <Route path="/dashboard/finish/day" exact> <p style={{ textAlign: 'center' }}>Finish Day</p> </Route>
            <Route path="/dashboard/cruises" exact> <p style={{ textAlign: 'center' }}>My Cruises</p> </Route>
            <Route path="/dashboard/current-trip-days" exact> <p style={{ textAlign: 'center' }}>Days of current Trip</p> </Route>
            <Route path="/dashboard/map" exact> <p style={{ textAlign: 'center' }}>Map</p> </Route>
            <Route path="/dashboard/settings" exact> <p style={{ textAlign: 'center' }}>settings</p> </Route>
            <Route path="/dashboard/about" exact> <p style={{ textAlign: 'center' }}>About</p> </Route>
        </Switch>
    )


   return(
        <>
           <div className="Dashboard">
                <DashboardHeader
                    state={state}
                    setState={setState}/>
                <Menu
                    state={state}
                    setState={setState}/>
                <Routes/>
           </div>
        </>
    )
};

export default Dashboard;