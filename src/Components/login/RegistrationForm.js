import React, {useState} from 'react';
import {useAlert} from "react-alert";
import '../../style/login/RegistrationForm.scss';
import { Icon } from '@iconify/react';
import connection from '../connections';
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';
import bxLockOpen from '@iconify/icons-bx/bx-lock-open';

const RegistrationForm = () =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const alert = useAlert();

    const handleRegistrationEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleRegistrationPassword = (event) => {
        setPassword(event.target.value);
    };
    const handleRegistrationPasswordConfirm = (event) => {
        setPasswordConfirm( event.target.value);
    };
    //@TODO
    //Client site data validation!!!!
    const handleRegisterFormSubmission = (event) => {
        event.preventDefault();
        const data = {
            email: email,
            password: password,
            passwordConfirm: passwordConfirm
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };
        fetch(connection.server.concat("/api/user/register"), options)
            .then(response => {
                if (response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    alert.error( `${data.error}`);
                    console.error(data.error);
                }else{
                    alert.success('your account was created. Check your mailbox!');
                    setPassword('');
                    setEmail('');
                    setPasswordConfirm('');
                }
            })
            .catch(error => {
                alert.error( `${error}`);
                console.error(error);
            })
    };
        return (
            <>
                <form className="registrationForm" method="POST" onSubmit={handleRegisterFormSubmission}>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="text" name="emailRegistration" id="emailRegistration" value={email} onChange={handleRegistrationEmail} required />
                        <label htmlFor="emailRegistration" className="inputContainer__label">
                            <span className="labelContent"> <Icon className="labelIcon" icon={baselineAlternateEmail} />Email</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistration" id="passwordRegistration" value={password} onChange={handleRegistrationPassword} required />
                        <label htmlFor="passwordRegistration" className="inputContainer__label">
                            <span className="labelContent"><Icon className="labelIcon" icon={bxLockOpen} />Password</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistrationConfirm" id="passwordRegistrationConfirm" value={passwordConfirm} onChange={handleRegistrationPasswordConfirm} required />
                        <label htmlFor="passwordRegistrationConfirm" className="inputContainer__label">
                            <span className="labelContent"><Icon className="labelIcon" icon={bxLockOpen} />Confirm password</span>
                        </label>
                    </div>
                    <button className="registrationForm__SignUpButton" type="submit">Sign Up</button>
                </form>
            </>
        );
};

export default RegistrationForm;