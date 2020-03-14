import React from 'react';
import FacebookIcon from '../images/facebook.svg';
import GoogleIcon from '../images/google.svg';
import '../style/Header.scss';

const LoginHeader = (props) => {
    return (
        <div className="welcomeSection">
            <h1 className="welcomeSection__text">{props.mainText}</h1>
            <div className="welcomeSection__socialIcons">
                <img src={FacebookIcon} alt="facebookLogiIcon" />
                <img src={GoogleIcon} alt="googleLoginIcon" />
            </div>
            <h3 className="welcomeSection__secondaryText">{props.secondaryText}</h3>
        </div>
    );
}

export default LoginHeader;