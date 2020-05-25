import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import AddAlarmTwoToneIcon from '@material-ui/icons/AddAlarmTwoTone';
import CloudTwoToneIcon from '@material-ui/icons/CloudTwoTone';
import AddCommentTwoToneIcon from '@material-ui/icons/AddCommentTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import MapTwoToneIcon from '@material-ui/icons/MapTwoTone';
// import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import CancelScheduleSendTwoToneIcon from '@material-ui/icons/CancelScheduleSendTwoTone';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
import MenuLink from './MenuLink';
import WbSunnyTwoToneIcon from '@material-ui/icons/WbSunnyTwoTone';



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
        '& a': {
            color: 'green',
        }
    },
    startIcon: {
        fill: 'green',
    },
    add:{
        color: '#000046',
        '& a': {
            color: '#000046',
        }
    },
    addIcon: {
        fill: '#000046',
    },
    stats: {
        color: '#0570e6',
        '& a': {
            color: '#0570e6',
        }
    },
    statsIcon: {
        fill: '#0570e6'
    },
    danger: {
        color: '#e85214',
        '& a': {
            color: '#e85214',
        }
    },
    dangerIcon: {
        fill: '#e85214',
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
                <MenuLink link="/dashboard" text="Your Dashboard"> <DashboardTwoToneIcon /> </MenuLink>
            </List>
            <Divider />
            <List className={classes.start}>
                <MenuLink link="/dashboard/start/cruise" text="New cruise"> <SendTwoToneIcon className={classes.startIcon} /> </MenuLink>
                <MenuLink link="/dashboard/start/day" text="New day"> <SendTwoToneIcon className={classes.startIcon} /> </MenuLink>
            </List>
            <Divider/>
            <List className={classes.add}>
                <MenuLink link="/dashboard/add" text="Add hourly entry"> <AddAlarmTwoToneIcon className={classes.addIcon} /> </MenuLink>
                <MenuLink link="/dashboard/add/weather" text="Add weather note"> <CloudTwoToneIcon className={classes.addIcon} /> </MenuLink>
                <MenuLink link="/dashboard/add/action" text="Add on-board action"> <AddCommentTwoToneIcon className={classes.addIcon} /> </MenuLink>
                <MenuLink link="/dashboard/add/waypoint" text="Add waypoint"> <RoomTwoToneIcon className={classes.addIcon} /> </MenuLink>
                <MenuLink link="/dashboard/add/forecast" text="Received forecast"> <WbSunnyTwoToneIcon className={classes.addIcon} /> </MenuLink>
            </List>
            <Divider />
                <List className={classes.danger}>
                    <MenuLink link="/dashboard/finish/cruise" text="Finish cruise"> <CancelScheduleSendTwoToneIcon className={classes.dangerIcon} /> </MenuLink>
                    <MenuLink link="/dashboard/finish/day" text="Finish sailing day"> <CancelScheduleSendTwoToneIcon className={classes.dangerIcon} /> </MenuLink>
                </List>
            <Divider />
            <List className={classes.beforeLastSection+" "+classes.stats}>
                <MenuLink link="/dashboard/cruises" text="My cruises"><TrendingUpTwoToneIcon className={classes.statsIcon} /> </MenuLink>
                {/* <MenuLink link="/dashboard/current-trip-days" text="Days of the current trip"><DateRangeTwoToneIcon className={classes.statsIcon} /></MenuLink> */}
                <MenuLink link="/dashboard/map" text="Map"><MapTwoToneIcon className={classes.statsIcon} /></MenuLink>
            </List>
            <Divider/>
            <List>
                <MenuLink link="/dashboard/settings" text="Account settings"> <SettingsTwoToneIcon /> </MenuLink>
                <MenuLink link="/dashboard/about" text="About Online Logbook"> <InfoTwoToneIcon /> </MenuLink>
            </List>
            <Divider/>
            {/* <List style={{textAlign: 'left', color: 'gray'}}> */}
            <p style={{ textAlign: 'center', color: 'gray', fontSize: '13px', fontStyle: 'italic'}}> version {process.env.REACT_APP_VERSION}</p>
            {/* </List> */}
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