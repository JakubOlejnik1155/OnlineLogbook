import React, {useContext} from "react";
import AuthApi from "../../authAPI";
import Cookies from 'js-cookie';

const Dashboard =()=>{
    const Auth = useContext(AuthApi);
    const logOutHandler =() =>{
        Auth.setAuth(false);
        Cookies.remove("JsonWebToken");
        Cookies.remove("userId");
    };
    return(
        <>
            <h1>Hello This Is Your DashBoard</h1>
            <button onClick={logOutHandler}>loguot</button>
        </>
    )
};


export default Dashboard;

