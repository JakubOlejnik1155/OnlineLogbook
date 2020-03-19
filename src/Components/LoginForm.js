import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../style/LoginForm.scss';
import { Icon } from '@iconify/react';
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';
import bxLockOpen from '@iconify/icons-bx/bx-lock-open';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleLoginPassword = (event) => {
        setPassword(event.target.value);
    };
        return (
            <>
                <form className="loginForm">
                    <div className="loginForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="text" name="email" id="emialLogin" value={email} onChange={handleLoginEmail} required />
                        <label htmlFor="email" className="inputContainer__label">
                            <span className="labelContent">
                                <Icon className="labelIcon" icon={baselineAlternateEmail} />
                                Email
                            </span>
                        </label>
                    </div>
                    <div className="loginForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="password" id="password" value={password} onChange={handleLoginPassword} required />
                        <label htmlFor="password" className="inputContainer__label">
                            <span className="labelContent" >
                                <Icon className="labelIcon" icon={bxLockOpen} />
                                Password
                            </span>
                        </label>
                    </div>
                    <p className="ForgotPassword"><Link to="/forgotPass" className="ForgotPassword__Link"  type="button">Forgot your password?</Link></p>
                    <button className="loginForm__SignInButton" type="submit">Sign In</button>
                </form>
            </>
        );
};

export default LoginForm;