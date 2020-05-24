import React, { useContext, useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import '../../style/logged/Dashboard.scss';
import bg from '../../images/bg/1t.jpg';
import AuthApi from "../../authAPI";
import DashboardHeader from './DashboardHeader';
import Menu from './Menu';
import DashboardCharts from './RoutesComponents/DashboardCharts';
import NewcruiseForm from './RoutesComponents/NewCruiseForm';
import NewDayForm from './RoutesComponents/NewDayForm';
import HourEntryForm from './RoutesComponents/HourEntryForm';
import WeatherForm from './RoutesComponents/WeatherForm';
import NewWaypoint from './RoutesComponents/NewWaypoint';
import NewActionForm from "./RoutesComponents/NewActionForm";
import ForecastEntryForm from "./RoutesComponents/ForecastEntryForm";
import FinishDay from './RoutesComponents/FinishDay';
import FinishCruise from './RoutesComponents/FinishCruise';
import Map from './RoutesComponents/Map';
import Cruises from './RoutesComponents/Cruises';

const useStyles = makeStyles((theme)=>({
    DashboardContent: {
        width: '100%',
        flexGrow: 1,
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'stretch',
    }
}))



const Dashboard = () => {
    const Auth = useContext(AuthApi);
    const classes = useStyles();
    //STATES WITH MENU TOGGLE
    const [state, setState] = React.useState({
        isMenuOpened: false,
    });
    //check if user login
    useEffect(() => {
        //logout from dashboard
        const readCookie = () => {
            const userLoggedIn = Cookies.get("RefreshToken");
            if (userLoggedIn) {
                Auth.setAuth(true);
            } else {
                Auth.setAuth(false);
            }
        };
        readCookie();
    });

    const Routes = React.useMemo(() => (
        <Switch>
            <Route path="/dashboard" exact> <DashboardCharts /> </Route>
            <Route path="/dashboard/start/cruise" exact > <NewcruiseForm/> </Route>
            <Route path="/dashboard/start/day" exact> <NewDayForm /> </Route>
            <Route path="/dashboard/add" exact> <HourEntryForm/> </Route>
            <Route path="/dashboard/add/weather" exact> <WeatherForm /> </Route>
            <Route path="/dashboard/add/action" exact> <NewActionForm/> </Route>
            <Route path="/dashboard/add/waypoint" exact> <NewWaypoint /> </Route>
            <Route path="/dashboard/add/forecast" exact> <ForecastEntryForm /> </Route>
            <Route path="/dashboard/finish/cruise" exact> <FinishCruise /> </Route>
            <Route path="/dashboard/finish/day" exact> <FinishDay /></Route>
            <Route path="/dashboard/cruises" exact> <Cruises /> </Route>
            {/* <Route path="/dashboard/current-trip-days" exact> <p style={{ textAlign: 'center' }}>Days of current Trip</p> </Route> */}
            <Route path="/dashboard/map" exact> <Map /> </Route>
            <Route path="/dashboard/settings" exact> <p style={{ textAlign: 'center' }}>settings</p> </Route>
            <Route path="/dashboard/about" exact> <p style={{ textAlign: 'center' }}>About</p> </Route>
        </Switch>
    ),[])


   return(
        <>
           <div className="Dashboard">
                <DashboardHeader
                    state={state}
                    setState={setState}/>
                <Menu
                    state={state}
                    setState={setState}/>
                <div className={classes.DashboardContent}>
                     {Routes}
                </div>
           </div>
        </>
    )
};

export default Dashboard;