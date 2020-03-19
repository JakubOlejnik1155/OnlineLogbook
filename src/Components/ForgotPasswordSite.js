import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../images/logo-white.svg';
import '../style/ForgotPasswordSite.scss';
import { Icon } from '@iconify/react';
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';

const ForgotPasswordSite = () => {
    const [email, setEmail] = useState('');

    const handleEmailInputChange =(event)=>{
        setEmail(event.target.value);
    };

    return (
        <>
        <div className="logo">
            <img className="logo__image" src={Logo} alt="logo" />
        </div>
        <div className="forgotPasswordWrapper">
            <div className="textFormContainer">
                    <h3 className="header">Enter your Email!</h3>
                    <p className="underHeader">We will send you an email with link to change password</p>
                    <form className="forgotPasswordForm">
                        <div className="forgotPasswordForm__inputContainer inputContainer">
                            <input className="inputContainer__input" type="text" name="emailForgetPassword" id="emailForgetPassword" value={email} onChange={handleEmailInputChange} required />
                            <label htmlFor="emailForgetPassword" className="inputContainer__label">
                                <span className="labelContent"><Icon className="ForgotPassword-labelIcon" icon={baselineAlternateEmail} />Email</span>
                            </label>
                        </div>
                        <button className="registrationForm__SignUpButton" type="submit">send</button>
                    </form>
                    <p className="LinkContainer"><Link to="/login" className="backToLogin"> Back to Sign In page</Link></p>
            </div>
        </div>
        </>
     );
};

export default ForgotPasswordSite;