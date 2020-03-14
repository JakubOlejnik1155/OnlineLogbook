import React, {useState, useEffect } from 'react';
import {Switch,Route} from "react-router-dom";
import BadPath from './Components/BadPath';
import LoginSite from './Components/LoginSite';
import RegistrationSite from './Components/RegistrationSite';
import ForgotPasswordSite from './Components/ForgotPasswordSite';
import './style/App.scss';




//class App extends Component {
const App =  () => {

    //@TODO ==> changing locations in componentDidMount before build production version
    useEffect(()=>{
    if (window.location.href === 'http://localhost:3000/' || window.location.href === 'http://192.168.1.11:3000/')
      window.history.pushState("object or string", "Title", "/login");
    });

    return (
      <>
            <Switch>
              <Route path="/" exact component={LoginSite} />
              <Route path="/login" exact component={LoginSite} />
              <Route path="/registration" exact component={RegistrationSite} />
              <Route path="/forgotPass" exact component={ForgotPasswordSite}/>
              <Route component={BadPath} />
            </Switch>
        </>
    );
}

export default App;
