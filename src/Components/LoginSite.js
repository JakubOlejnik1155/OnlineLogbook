import React from 'react';
import LoginForm from './LoginForm';
import Header from './Header';
import ChangeSection from './ChangeSection';
import Logo from '../images/logo.svg';
import '../style/Logo.scss';

const LoginSite = () => {
    return (
        <>
            <div className="wrapper">
                <div className="logo">
                    <img className="logo__image" src={Logo} alt="logo" />
                </div>
                <div className="formsPlusChanegeSection">
                        <div className="formsContainer__loginForm">
                            <Header
                                mainText="Sign in to online logbook"
                                secondaryText="or use your email account:" />
                            <LoginForm />
                        </div>
                    <div className="changeSection">
                        <ChangeSection
                            message="If your do not have an account, enter your personal details and start your cruise with us."
                            btnText="sign up"
                            path="/registration"
                        />
                    </div>
                </div>
            </div>
        </>
     );
}

export default LoginSite;