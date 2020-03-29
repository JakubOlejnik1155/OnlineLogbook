import React, {useContext, useState} from 'react';
import { Link } from "react-router-dom";
import '../../style/LoginForm.scss';
import { Icon } from '@iconify/react';
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';
import bxLockOpen from '@iconify/icons-bx/bx-lock-open';
import conections from '../connections';
import {useAlert} from "react-alert";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';

const LoginForm = () => {
    //attributes
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();
    const Auth = useContext(AuthApi);
    //methods

    const handleLoginEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleLoginPassword = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginFormSubmission = (event) =>{
        event.preventDefault();
        const data = {
          email: email,
          password: password
        };
        const options={
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(conections.address.concat("/api/user/login"), options)
            .then(response => {
                if (response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .then(res=>res.json())
            .then(data => {
                if (data.error){
                    alert.error( `${data.error}`);
                    console.log(data.error);
                }
                else{
                    const fiveMinutes = 1/288;
                     Cookies.set("JsonWebToken", data.jwt, { expires: fiveMinutes });
                     Cookies.set("userId", data.userId, { expires: fiveMinutes });
                     Auth.setAuth(true);
                }

            })
            .catch(error=>{
                alert.error(`${error}`);
                console.error(error);
            })

    };



        return (
            <>
                <form className="loginForm" onSubmit={handleLoginFormSubmission}>
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