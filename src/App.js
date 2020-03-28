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
import './style/App.scss';

const App =  () => {

    const [auth, setAuth] = useState();
    //alert options based on windowWidth
    let options = {
        timeout: 5000,
        position: positions.BOTTOM_LEFT,
    };
    if (window.innerWidth < 1024 ){options.position = positions.TOP_RIGHT;}


    useEffect(()=>{
        readCookie();
    });

    const readCookie = () =>{
        const userLoggedIn = Cookies.get("JsonWebToken");
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
                render={()=> !auth?<Component />:<Redirect to="/dashboard"/>}
            />
        )
    };
    const Routes =()=>{
        const Auth = useContext(AuthApi);
      return(
          <Switch>
              <ProtectedLogin path="/" exact component={LoginSite} auth={Auth.auth}/>
              <ProtectedLogin path="/login" exact component={LoginSite} auth={Auth.auth} />
              <Route path="/registration" exact component={RegistrationSite} />
              <Route path="/forgotPass" exact component={ForgotPasswordSite}/>
              <Route path="/userValidation" component={UserEmailValidation}/>
              <Route path="/setNewPassword" component={SetNewPasswordSite} />
              <ProtectedRoute path="/dashboard" auth={Auth.auth} component={Dashboard} />
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
