import React, {Component} from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import BadPath from './Components/BadPath';
import LoginSite from './Components/LoginSite';
import RegistrationSite from './Components/RegistrationSite';
import './style/App.scss';




class App extends Component {
  //@TODO ==> changing locations in componentDidMount before build production version
  componentDidMount() {
    if (window.location.href === 'http://localhost:3000/' || window.location.href === 'http://192.168.1.11:3000/')
      window.history.pushState("object or string", "Title", "/login");
  }
  render(){
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/" exact component={LoginSite} />
          <Route path="/login" exact component={LoginSite}/>
          <Route path ="/registration" exact component={RegistrationSite}/>
          <Route component={BadPath} />
        </Switch>
      </Router>
    );
  }
}

export default App;
