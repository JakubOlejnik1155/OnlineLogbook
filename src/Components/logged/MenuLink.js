import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
const MenuLink = (props) => {
    return (
        <Link to={props.link}>
            <ListItem button>
                <ListItemIcon> {props.children} </ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItem>
        </Link>
     );
}

export default MenuLink;