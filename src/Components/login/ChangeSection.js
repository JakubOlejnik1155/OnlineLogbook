import React from 'react';
import { Link } from "react-router-dom";
import '../../style/login/ChangeSection.scss';

const ChangeSection = (props) => {
    return (
        <>
            <div className="bgImage"></div>
            <div className="InnerChangeSection">
                <p className="changeMessage">{props.message}</p>
                <Link to={props.path}className="changeSection__button" style={{color: 'white'}}>{props.btnText}</Link>
            </div>
        </>

    );
};

export default ChangeSection;