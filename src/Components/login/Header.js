import React, {useContext} from 'react';
import '../../style/Header.scss';
import { Icon } from '@iconify/react';
import { useAlert} from 'react-alert'
import connection from '../connections';
import bxlFacebookCircle from '@iconify/icons-bx/bxl-facebook-circle';
import bxlGooglePlusCircle from '@iconify/icons-bx/bxl-google-plus-circle';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Cookies from "js-cookie";
import AuthApi from "../../authAPI"
require('dotenv').config();

const LoginHeader = (props) => {
    const alert = useAlert();
    const Auth = useContext(AuthApi)
    const responseFacebook = (response) => {
        console.log(response);
        if(response.status !== "unknown")
            addFbUser(response.email, response.picture.data.url);
    };

    const addFbUser = (email, pictureUrl) => {
        const data = {
            email: email,
            profilePicture: pictureUrl
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }
        fetch(connection.server.concat("/api/user/facebook"), options)
            .then(response => {
                if(response.ok) return response;
                throw Error(response.status.toString())
            })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert.error(`${data.error}`);
                    console.error(data.error);
                }else{
                    //zaloguj ciasteczka i inne takie
                    console.log(data);
                    const fiveMinutes = 1/288;
                    Cookies.set("JsonWebToken", data.accessToken, {expires: fiveMinutes});
                    Cookies.set("RefreshToken", data.refreshToken, { expires: 365 });
                    Auth.setAuth(true);
                }
            })
            .catch(error => {
                alert.error(`${error}`);
            })
    }

    return (
        <div className="welcomeSection">
            <h1 className="welcomeSection__text">{props.mainText}</h1>
            <div className="welcomeSection__socialIcons">
                <FacebookLogin
                    appId={process.env.REACT_APP_FBAPPKEY}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    render={renderProps => (
                        <Icon className="socialLoginIcon" icon={bxlFacebookCircle} onClick={renderProps.onClick}/>
                    )}
                />
                <Icon className="socialLoginIcon" icon={bxlGooglePlusCircle} />
            </div>
            <h3 className="welcomeSection__secondaryText">{props.secondaryText}</h3>
        </div>
    );
};

export default LoginHeader;