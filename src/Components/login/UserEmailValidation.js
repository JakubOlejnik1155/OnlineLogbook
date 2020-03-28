import React, {useEffect} from "react";
import {useAlert} from "react-alert";
import '../../style/UserEmailValidation.scss'
import connection from '../connections';
import Logo from "../../images/logo-white.svg";


const UserEmailValidation =()=>{
    const alert = useAlert();
    useEffect(()=>{
        //get token from url
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        //fetch options
        const options ={
            method: 'PUT',
        };
        fetch(connection.address.concat(`/api/user/validation/${token}`), options)
            .then(response=>{
                if (response.ok)
                    return response;
                throw Error(response.status.toString());
            })
            .then(res => res.json())
            .then(data =>{
                if (data.error){
                    alert.error( `${data.error}`);
                    console.error(data.error);
                }else{
                    alert.success('Your email was verified successfully!!!');
                    setTimeout( ()=>{
                        window.location.replace(connection.mainSite);
                    },5000);
                }
            })
            .catch(error => {
                alert.error(`${error}`);
                console.error(error);
            })
    });
  return(
      <>
        <div className="emailValidationSiteWrapper">
            <div className="logo">
                <img className="logo__image" src={Logo} alt="logo" />
            </div>
            <div className="emailValidationSiteWrapper__validationMessage">
                <p className="mainMessage">We are validating your email!</p>
                <p className="secondaryMessage">please be patient it may take a while... </p>
            </div>
        </div>
      </>
  );
};

export default  UserEmailValidation;