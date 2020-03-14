import React, { Component } from 'react';
import '../style/RegistrationForm.scss';
class RegistrationForm extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
    }
    handleRegistrationEmail=(event)=>{
        this.setState({ email: event.target.value });
    }
    handleRegistrationPassword=(event)=>{
        this.setState({ password: event.target.value });
    }
    handleRegistrationPasswordConfirm =(event)=>{
        this.setState({ passwordConfirm: event.target.value });
    }
    render() {
        return (
            <>
                <form className="registrationForm">
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="text" name="emailRegistration" id="emailRegistration" value={this.state.email} onChange={this.handleRegistrationEmail} required />
                        <label htmlFor="emailRegistration" className="inputContainer__label">
                            <span className="labelContent">email</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistration" id="passwordRegistration" value={this.state.password} onChange={this.handleRegistrationPassword} required />
                        <label htmlFor="passwordRegistration" className="inputContainer__label">
                            <span className="labelContent">password</span>
                        </label>
                    </div>
                    <div className="registrationForm__inputContainer inputContainer">
                        <input className="inputContainer__input" type="password" name="passwordRegistrationConfirm" id="passwordRegistrationConfirm" value={this.state.passwordConfirm} onChange={this.handleRegistrationPasswordConfirm} required />
                        <label htmlFor="passwordRegistrationConfirm" className="inputContainer__label">
                            <span className="labelContent">confirm password</span>
                        </label>
                    </div>
                    <button className="registrationForm__SignUpButton" type="submit">Sign Up</button>
                </form>
            </>
        );
    }
}

export default RegistrationForm;