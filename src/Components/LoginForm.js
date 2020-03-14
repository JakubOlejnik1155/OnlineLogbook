import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../style/LoginForm.scss';

class LoginForm extends Component {
    state = {
        email: '',
        password: ''
    }
    handleLoginEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    }
    handleLoginPassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }
    render() {
        return (
            <>
                <form className="loginForm">
                    <div className="loginForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="text" name="email" id="emialLogin" value={this.state.email} onChange={this.handleLoginEmail} required />
                        <label htmlFor="email" className="inputContainer__label">
                            <span className="labelContent">email</span>
                        </label>
                    </div>
                    <div className="loginForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="password" id="password" value={this.state.password} onChange={this.handleLoginPassword} required />
                        <label htmlFor="password" className="inputContainer__label">
                            <span className="labelContent" >password</span>
                        </label>
                    </div>
                    <p className="ForgotPassword"><Link to="/forgotPass" className="ForgotPassword__Link"  type="button">Forgot your password?</Link></p>
                    <button className="loginForm__SignInButton" type="submit">Sign In</button>
                </form>
            </>
        );
    }
}

export default LoginForm;