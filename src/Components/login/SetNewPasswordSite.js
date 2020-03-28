import React, {useState} from "react";
import Logo from "../../images/logo.svg";
import {useAlert} from "react-alert";
import {Icon} from "@iconify/react";
import bxLockOpen from "@iconify/icons-bx/bx-lock-open";
import  connections from '../connections';
import '../../style/SetNewPasswordSite.scss';


const SetNewPasswordSite =()=>{
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const alert = useAlert();

    const handleNewPass = (event) => {
        setNewPassword(event.target.value);
    };
    const handleConfirmNewPassword = (event) => {
        setConfirmNewPassword(event.target.value);
    };

    const handleSetNewPasswordSubmission = (event) => {
      event.preventDefault();
      //get token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const data ={
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      };
      const options ={
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      };
      fetch(connections.address.concat(`/api/user/setNewPassword/${token}`), options)
          .then(response =>{
              if (response.ok)
                  return response;
              throw Error(response.status.toString());
          })
          .then(res => res.json())
          .then(data =>{
              if (data.error){
                alert.error(`${data.error}`);
                console.error(data.error);
              }else{
                alert.success("The password has been successfully changed");
                setTimeout(()=>{
                    window.location.replace(connections.mainSite);
                }, 5000);
              }
          })
          .catch(error =>{
              alert.error(`${error}`);
              console.error(error);
          })
    };



    return(
        <>
            <div className="logo">
                <img className="logo__image" src={Logo} alt="logo" />
            </div>
           <div className="SetNewPassWrapper">
               <div className="textFormContainer">
                   <h3 className="header">Welcome Back!</h3>
                   <p className="underHeader">Set Your new password. Try not to forget it this time!</p>
                   <form className="SetNewPasswordForm" onSubmit={handleSetNewPasswordSubmission} >
                               <div className="SetNewPasswordForm__inputContainer inputContainer">
                               <input className="inputContainer__input" type="password" name="newPasswordInput"
                                      id="newPasswordInput" value={newPassword} onChange={handleNewPass} required />
                               <label htmlFor="newPasswordInput" className="inputContainer__label">
                                   <span className="labelContent"><Icon className="ForgotPassword-labelIcon" icon={bxLockOpen} />new Password</span>
                               </label>
                           </div>
                           <div className="SetNewPasswordForm__inputContainer inputContainer">
                               <input className="inputContainer__input" type="password" name="confirmNewPassword"
                                      id="confirmNewPassword" value={confirmNewPassword} onChange={handleConfirmNewPassword} required />
                               <label htmlFor="confirmNewPassword" className="inputContainer__label">
                                   <span className="labelContent"><Icon className="ForgotPassword-labelIcon" icon={bxLockOpen} />confirm new Password</span>
                               </label>
                           </div>
                        <button className="registrationForm__SignUpButton" type="submit">Set</button>
                    </form>
               </div>
           </div>

        </>
    )
};

export default SetNewPasswordSite;