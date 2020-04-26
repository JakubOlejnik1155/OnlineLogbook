import React from 'react'
import Cookies from 'js-cookie';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    avatar: {
        height: 38,
        width: 38,
        marginRight: 15,
    },
    nonePic: {
        backgroundColor: "primary",
        height: 38,
        width: 38,
        marginRight: 15,
    }
}));
const StyledBadge = withStyles((theme) => ({
    badge: {
        marginRight: 15,
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
        }
    }
}))(Badge);

const UserProfilePicture = () => {

    const classes = useStyles();

    return(
        <StyledBadge
            overlap="circle"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            variant="dot"
        >
            {Cookies.get('pp') !== "undefined" ? (
                <Avatar alt="userPicture" src={Cookies.get('pp')} className={classes.avatar} />
            ) : (
                    <Avatar alt="userPicture" className={classes.nonePic} />
                )}

        </StyledBadge>
    )
};

export default UserProfilePicture;