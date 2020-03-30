import React, {useContext} from "react";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import '../../style/logged/Dashboard.scss';
import connections from '../connections';

const Dashboard =()=>{
    const Auth = useContext(AuthApi);
    const logOutHandler = () => {
        const currestJwt = Cookies.get("JsonWebToken");
        const userId = Cookies.get("userId");
        const data = {
            JsonWebToken: currestJwt,
            userId: userId
        };
        const options ={
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };

        fetch(connections.address.concat(`/api/user/logout/${userId}`), options)
            .then(response => {
                if(response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .catch(error =>{
                console.log(error);
            })






        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("userId");
    };
    return(
        <>
            <div className="Dashboard">


                <header className="Dashboard__header DHeader">
                    <div className="DHeader__Logo">
                        <img className="DHeader__image" src={Logo} alt="logo" />
                        <h1 className="DHeader__title">Online Logbook</h1>
                    </div>
                    <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
                </header>


            </div>
        </>
    )
};


export default Dashboard;

