import React from 'react';
import { Link } from "react-router-dom";
import '../../style/logged/Dashboard.scss'
//@TODO
//styling to bad path route
const BadPath = () => {
    return (
        <div className="BadPathWrapper">
            <div className="contentWrapper">
                    <p className="errorNumber">Error number: <span className='erNumber'>404</span></p>
                    <p>It looks like the page you are looking for does not exist</p>
                    <Link id="back" to="/login">Go to Log In Page</Link>
            </div>
        </div >
     );
};

export default BadPath;