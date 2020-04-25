import React, {useContext} from 'react'
import Cookies from 'js-cookie';
import Logo from '../../images/logo.svg';
import AuthApi from "../../authAPI";
import { Link } from 'react-router-dom';
import connections from '../connections';
const DashBoardHeader = () => {

    const Auth = useContext(AuthApi);

    const logOutHandler = () => {
        deleteRefreshToken();
        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("RefreshToken");
        Cookies.remove("pp");
    };

    //deleting RT from DB
    const deleteRefreshToken = () => {
        const currentRefreshToken = Cookies.get("RefreshToken");
        const data = {
            RJwt: currentRefreshToken
        };
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(connections.authServer.concat("/api/user/logout"), options)
            .then(response => {
                if (response.ok) return response;
                else throw Error(response.status.toString());
            })
            .catch(error => console.error(error))
    };

    return (
        <header className="Dashboard__header DHeader">
            <div className="DHeader__Logo">
                <Link to="/dashboard" style={{ display: "flex" }}>
                    <img className="DHeader__image" src={Logo} alt="logo" />
                </Link>
                <h1 className="DHeader__title">Online Logbook</h1>
            </div>
            {Cookies.get("pp") !== "undefined" && (<img className="DHeader__ProfilePicture" src={Cookies.get("pp")} alt="" />)}
            <button className="DHeader__SignOutBtn" onClick={logOutHandler}>Sign Out</button>
        </header>
     );
}

export default DashBoardHeader;