import React, {useContext, useEffect, useState} from 'react';
import {Switch,Route, Redirect} from "react-router-dom";
import BadPath from './Components/login/BadPath';
import LoginSite from './Components/login/LoginSite';
import RegistrationSite from './Components/login/RegistrationSite';
import ForgotPasswordSite from './Components/login/ForgotPasswordSite';
import UserEmailValidation from './Components/login/UserEmailValidation';
import SetNewPasswordSite from "./Components/login/SetNewPasswordSite";
import Dashboard from "./Components/logged/Dashboard";
import AuthApi from "./authAPI";
import Cookies from 'js-cookie';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import './style/login/App.scss';





const App =  () => {

    const [auth, setAuth] = useState();
    //alert options based on windowWidth
    let options = {
        timeout: 5000,
        position: positions.BOTTOM_LEFT,
    };
    if (window.innerWidth < 1024 ){options.position = positions.TOP_RIGHT;}


    useEffect(()=>{
        if (!window.location.href.includes("userValidation")) //NOTE: prevent double notification while userValidationEmail
            readCookie();
    });

    const readCookie = () => {
        const userLoggedIn = Cookies.get("RefreshToken");
        if (userLoggedIn){
            setAuth(true);
        }else{
            setAuth(false);
        }
    };

    const ProtectedRoute = ({component: Component, ...rest}) =>{
        return(
            <Route
                {...rest}
                render={()=> auth?<Component />:<Redirect to="/login"/>}
            />
        )
    };
    const ProtectedLogin = ({component: Component, ...rest}) =>{
        return(
            <Route
                {...rest}
                //TODO: Change to dashboard
                render={() => !auth ? <Component /> : <Redirect to="/dashboard/finish/cruise"/>}
            />
        )
    };
    const Routes =()=>{
        const Auth = useContext(AuthApi);
      return(
          <Switch>
              <ProtectedLogin path="/" exact component={LoginSite} auth={Auth.auth}/>
              <ProtectedLogin path="/login" exact component={LoginSite} auth={Auth.auth} />
              <ProtectedLogin path="/registration" exact component={RegistrationSite} />
              <ProtectedLogin path="/forgotPass" exact component={ForgotPasswordSite}/>
              <ProtectedLogin path="/userValidation" component={UserEmailValidation}/>
              <ProtectedLogin path="/setNewPassword" component={SetNewPasswordSite} />
              <ProtectedRoute path="/dashboard" auth={Auth.auth} component={Dashboard}/>
              <Route component={BadPath} />
          </Switch>
      )
    };

    return (
        <Provider template={AlertTemplate} {...options}>
            <AuthApi.Provider value={{auth,setAuth}}>
                <Routes/>
            </AuthApi.Provider>
        </Provider>
    );
};

export default App;
