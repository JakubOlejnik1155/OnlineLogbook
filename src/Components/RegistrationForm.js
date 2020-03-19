import React, { Component } from 'react';
import '../style/RegistrationForm.scss';
import { Icon } from '@iconify/react';
import connection from '../connections';
import baselineAlternateEmail from '@iconify/icons-ic/baseline-alternate-email';
import bxLockOpen from '@iconify/icons-bx/bx-lock-open';
class RegistrationForm extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
    }
    handleRegistrationEmail = (event) => {
        this.setState({ email: event.target.value });
    }
    handleRegistrationPassword = (event) => {
        this.setState({ password: event.target.value });
    }
    handleRegistrationPasswordConfirm = (event) => {
        this.setState({ passwordConfirm: event.target.value });
    }
    //@TODO
    //Client site data validation!!!!
    handleRegisterFormSubmition = (event) => {
        event.preventDefault();
        const { email, password, passwordConfirm } = this.state;
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
        fetch(connection.address.concat("/api/user/register"), options)
            .then(response => {
                if (response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .then(res => res.json())
            .then(data => {
                //error message handling!!!!!
                console.log(data);
            })
            .catch(error => {
                //wrong address 404 exception handling
                console.log("error => ", error);
            })
    };
    render() {
        return (
            <>
                <form className="registrationForm" method="POST" onSubmit={this.handleRegisterFormSubmition}>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="text" name="emailRegistration" id="emailRegistration" value={this.state.email} onChange={this.handleRegistrationEmail} required />
                        <label htmlFor="emailRegistration" className="inputContainer__label">
                            <span className="labelContent"> <Icon className="labelIcon" icon={baselineAlternateEmail} />Email</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistration" id="passwordRegistration" value={this.state.password} onChange={this.handleRegistrationPassword} required />
                        <label htmlFor="passwordRegistration" className="inputContainer__label">
                            <span className="labelContent"><Icon className="labelIcon" icon={bxLockOpen} />Password</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistrationConfirm" id="passwordRegistrationConfirm" value={this.state.passwordConfirm} onChange={this.handleRegistrationPasswordConfirm} required />
                        <label htmlFor="passwordRegistrationConfirm" className="inputContainer__label">
                            <span className="labelContent"><Icon className="labelIcon" icon={bxLockOpen} />Confirm password</span>
                        </label>
                    </div>
                    <button className="registrationForm__SignUpButton" type="submit">Sign Up</button>
                </form>
            </>
        );
    }
}

export default RegistrationForm;