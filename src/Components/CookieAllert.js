import React from 'react';
import { useEffect } from 'react';


const CookieAllert = () => {


    useEffect(()=>{
        setTimeout(()=>{
            if (!localStorage.getItem("cookieBannerDisplayed")){
                document.querySelector('.cookieContainer').classList.add("cookieContainerActive");
            }
        }, 2000)
    },[])

    return (
        <div className="cookieContainer" >
            <p style={{margin: '20px 20px 0 20px', color: 'snow'}}>
                We use cookies, to give you the best experience on oursite. To find out more about our cookie and privacy policy contact us on <a href="mailto: logbook1155@gmail.com" className="emailLink" style={{fontStyle: 'italic',color: 'rgb(153, 191, 210)'}}>logbook1155(a)gmail.com </a>
            </p>
            <button
                className="loginForm__SignInButton cookieBtn"
                style={{width: '100px', margin: '10px auto',  fontSize: "16px", padding:0, height: '25px'}}
                onClick={() => {
                    document.querySelector('.cookieContainer').classList.remove("cookieContainerActive");
                    localStorage.setItem("cookieBannerDisplayed", true);
                }}
            >
                Okay
            </button>
        </div>
     );
}

export default CookieAllert;