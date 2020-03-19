import React, { useEffect } from 'react';
import {Switch,Route} from "react-router-dom";
import BadPath from './Components/BadPath';
import LoginSite from './Components/LoginSite';
import RegistrationSite from './Components/RegistrationSite';
import ForgotPasswordSite from './Components/ForgotPasswordSite';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import './style/App.scss';

//class App extends Component {
const App =  () => {
    const options = {
        timeout: 5000,
        position: positions.BOTTOM_CENTER
    };
    //@TODO ==> changing locations in componentDidMount before build production version
    useEffect(()=>{
    if (window.location.href === 'http://localhost:3001/' || window.location.href === 'http://192.168.1.14:30001/')
      window.history.pushState("object or string", "Title", "/login");
    });
    return (
        <Provider template={AlertTemplate} {...options}>
            <Switch>
              <Route path="/" exact component={LoginSite} />
              <Route path="/login" exact component={LoginSite} />
              <Route path="/registration" exact component={RegistrationSite} />
              <Route path="/forgotPass" exact component={ForgotPasswordSite}/>
              <Route component={BadPath} />
            </Switch>
        </Provider>
    );
};

export default App;
