import React from 'react';
import RegistrationForm from './RegistrationForm';
import Header from './Header';
import ChangeSection from './ChangeSection';
import Logo from '../../images/logo.svg';
import '../../style/Logo.scss';


const RegistrationSite = () => {
    return (
        <>
          <div className="wrapper">
            <div className="logo">
              <img className="logo__image" src={Logo} alt="logo" />
            </div>
            <div className="formsPlusChanegeSection">
                <div className="formsContainer__registrationForm">
                  <Header
                    mainText="Create account"
                    secondaryText="or use your email for registration:" />
                  <RegistrationForm />
                </div>
                <div className="changeSection">
                    <ChangeSection
                        message="If you already have an account, log in to fill your online logbook"
                        btnText="sign in"
                        path="/login"
                    />
                </div>
            </div>
          </div>
        </>
     );
};

export default RegistrationSite;