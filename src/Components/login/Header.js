import React from 'react';
import '../../style/Header.scss';
import { Icon } from '@iconify/react';
import bxlFacebookCircle from '@iconify/icons-bx/bxl-facebook-circle';
import bxlGooglePlusCircle from '@iconify/icons-bx/bxl-google-plus-circle';


const LoginHeader = (props) => {
    return (
        <div className="welcomeSection">
            <h1 className="welcomeSection__text">{props.mainText}</h1>
            <div className="welcomeSection__socialIcons">
                <Icon className="socialLoginIcon" icon={bxlFacebookCircle} />
                <Icon className="socialLoginIcon" icon={bxlGooglePlusCircle} />
            </div>
            <h3 className="welcomeSection__secondaryText">{props.secondaryText}</h3>
        </div>
    );
};

export default LoginHeader;