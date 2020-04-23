import React, {useContext} from 'react';
import '../../style/login/Header.scss';
import { Icon } from '@iconify/react';
import { useAlert} from 'react-alert'
import connection from '../connections';
import googleIcon from '@iconify/icons-flat-color-icons/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import bxlFacebook from '@iconify/icons-bx/bxl-facebook';
import { GoogleLogin } from 'react-google-login';
import Cookies from "js-cookie";
import AuthApi from "../../authAPI"
require('dotenv').config();

const LoginHeader = (props) => {
    const alert = useAlert();
    const Auth = useContext(AuthApi)

    const responseFacebook = (response) => {
        if(response.status !== "not_authorized")
            addSocialUser(response.email, response.picture.data.url);
    };

    const responseGoogle = response => {
        addSocialUser(response.profileObj.email, response.profileObj.imageUrl);
    };
    const responseGoogleFail = () => {
        alert.error("something get wrong");
    };
    const addSocialUser = (email, pictureUrl) => {
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
        fetch(connection.server.concat("/api/user/socialuser"), options)
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
                    //login
                    const fiveMinutes = 1/288;
                    Cookies.set("JsonWebToken", data.accessToken, {expires: fiveMinutes});
                    Cookies.set("RefreshToken", data.refreshToken, { expires: 365 });
                    Cookies.set('pp', data.profilePicture, { expires: 365 });
                    Auth.setAuth(true);
                }
            })
            .catch(error => {
                alert.error(`${error}`);
            })
    };

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
                        <Icon className="socialLoginIcon" icon={bxlFacebook} onClick={renderProps.onClick}/>
                    )}
                />
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLEAPPKEY}
                    render={renderProps => (
                        <Icon className="socialLoginIcon" icon={googleIcon} onClick={renderProps.onClick}/>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogleFail}
                    cookiePolicy={'single_host_origin'}
                />

            </div>
            <h3 className="welcomeSection__secondaryText">{props.secondaryText}</h3>
        </div>
    );
};

export default LoginHeader;