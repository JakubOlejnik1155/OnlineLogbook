import React from 'react';
import { Link } from "react-router-dom";
import '../../style/BadPath.scss'

const BadPath = () => {
    return (
        <div className="BadPathWrapper">
            <div className="contentWrapper">
                    <p>Error number: <span className='errorNumber'>404</span></p>
                    <p>It looks like the page you are looking for does not exist</p>
                    <Link id="back" to="/login">Go to Log In Page</Link>
            </div>
        </div >
     );
};

export default BadPath;