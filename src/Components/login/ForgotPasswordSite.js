import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../images/logo-white.svg';
import '../../style/ForgotPasswordSite.scss';
import { Icon } from '@iconify/react';
import connection from '../connections';
import {useAlert} from "react-alert";
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';

const ForgotPasswordSite = () => {
    const [email, setEmail] = useState('');
    const alert = useAlert();

    const handleEmailInputChange =(event)=>{
        setEmail(event.target.value);
    };
    const handlePasswordRenewFormSubmission =(event)=>{
        event.preventDefault();
        const data = {
            email: email,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };
        fetch(connection.server.concat("/api/user/renewPassword"), options)
            .then(response => {
                if (response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .then(res => res.json())
            .then(data =>{
                if (data.error){
                    alert.error(`${data.error}`);
                    console.log(data.error);
                }else{
                    alert.success("We send you en email. Check your mailbox!");
                    setEmail('');
                }
            })
            .catch(error=>{
                alert.error(error);
                console.log(error);
            })
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
                    <form className="forgotPasswordForm" onSubmit={handlePasswordRenewFormSubmission}>
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