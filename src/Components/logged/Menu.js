import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import AddAlarmTwoToneIcon from '@material-ui/icons/AddAlarmTwoTone';
import CloudTwoToneIcon from '@material-ui/icons/CloudTwoTone';
import AddCommentTwoToneIcon from '@material-ui/icons/AddCommentTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import MapTwoToneIcon from '@material-ui/icons/MapTwoTone';
import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import CancelScheduleSendTwoToneIcon from '@material-ui/icons/CancelScheduleSendTwoTone';
const useStyles = makeStyles(theme => ({
    list: {
        width: 260,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    beforeLastSection:{
        marginBottom: 'auto'
    },
    start:{
        color: 'green',
    },
    startIcon: {
        fill: 'green',
    },
    add:{
        color: '#000046',
    },
    addIcon: {
        fill: '#000046',
    },
    stats: {
        color: '#0570e6'
    },
    statsIcon: {
        fill: '#0570e6'
    },
    danger: {
        color: '#e85214',
    },
    dangerIcon: {
        fill: '#e85214',
    },
    margin: {
        margin: theme.spacing(1),
    }
}));

export default function Menu(props) {
    const classes = useStyles();


    const list = () => (
        <div
            className={classes.list}
            role="presentation"
            onClick={() => props.setState({ isMenuOpened: !props.state.isMenuOpened })}
            onKeyDown={() => props.setState({ isMenuOpened: !props.state.isMenuOpened })}
        >
            <List>
                <Link to="/dashboard">
                    <ListItem button>
                        <ListItemIcon> <DashboardTwoToneIcon /> </ListItemIcon>
                        <ListItemText primary={"Your Dashboard"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List className={classes.start}>
                <ListItem button>
                    <ListItemIcon> <SendTwoToneIcon className={classes.startIcon}/> </ListItemIcon>
                    <ListItemText primary={"New cruise"} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon> <SendTwoToneIcon className={classes.startIcon}/> </ListItemIcon>
                    <ListItemText primary={"New day"} />
                </ListItem>
            </List>
            <Divider/>
            <List className={classes.add}>
                <ListItem button>
                    <ListItemIcon> <AddAlarmTwoToneIcon className={classes.addIcon}/> </ListItemIcon>
                    <ListItemText primary={"Add hourly entry"} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon> <CloudTwoToneIcon className={classes.addIcon}/> </ListItemIcon>
                    <ListItemText primary={"Add weather note"} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon> <AddCommentTwoToneIcon className={classes.addIcon}/> </ListItemIcon>
                    <ListItemText primary={"Add on-board action"} />
                </ListItem>
            </List>
            <Divider />
                <List className={classes.danger}>
                    <ListItem button>
                    <ListItemIcon> <CancelScheduleSendTwoToneIcon className={classes.dangerIcon}/> </ListItemIcon>
                        <ListItemText primary={"Finish cruise"} />
                    </ListItem>
                    <ListItem button>
                    <ListItemIcon> <CancelScheduleSendTwoToneIcon className={classes.dangerIcon}/> </ListItemIcon>
                        <ListItemText primary={"Finish sailing day"} />
                    </ListItem>
                </List>
            <Divider />
                <List className={classes.beforeLastSection+" "+classes.stats}>
                    <ListItem button>
                        <ListItemIcon> <TrendingUpTwoToneIcon className={classes.statsIcon} /> </ListItemIcon>
                        <ListItemText primary={"My cruises"} />
                    </ListItem>
                    <ListItem button>
                    <ListItemIcon> <DateRangeTwoToneIcon className={classes.statsIcon}/> </ListItemIcon>
                        <ListItemText primary={"Days of the current trip"} />
                    </ListItem>
                    <ListItem button>
                    <ListItemIcon> <MapTwoToneIcon className={classes.statsIcon}/> </ListItemIcon>
                        <ListItemText primary={"Map"} />
                    </ListItem>
                </List>
            <Divider/>
            <List>
                <Link to="/dashboard/settings">
                    <ListItem button>
                        <ListItemIcon> <SettingsTwoToneIcon /> </ListItemIcon>
                        <ListItemText primary={"Account settings"} />
                    </ListItem>
                </Link>
                <ListItem button>
                    <ListItemIcon> <InfoTwoToneIcon /> </ListItemIcon>
                    <ListItemText primary={"About Online Logbook"} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <SwipeableDrawer
                anchor="left"
                open={props.state.isMenuOpened}
                onClose={() => props.setState({ isMenuOpened: !props.state.isMenuOpened })}
                onOpen={() => props.setState({ isMenuOpened: !props.state.isMenuOpened })}
            >
                {list()}
            </SwipeableDrawer>
        </>
    );
}