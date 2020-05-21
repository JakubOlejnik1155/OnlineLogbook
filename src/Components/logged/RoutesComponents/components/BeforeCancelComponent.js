import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { CircularProgress, withStyles } from '@material-ui/core';


import { DeleteRequestFunction, unauthorizedLogOut } from '../constants/functions';
import AuthApi from '../../../../authAPI';
import Allert from './Allert';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BeforeCancelComponent = ({ day, dialogOpen, setDialogOpen, daysArray, setData}) => {
    const Auth = React.useContext(AuthApi);
    const [loading, setLoading] = React.useState(false);
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    const handleClose = () => {
        setDialogOpen(false)
    };
    const deleteDay = (day) => {
        setLoading(true)
        const newDays = daysArray.data.filter((element)=> element._id !== day._id);
        DeleteRequestFunction(`/api/days/${day._id}`)
            .then(response => {
                if (response.error && response.error.code === 401) {
                    setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                    setTimeout(() => {
                        Auth.setAuth(false);
                        unauthorizedLogOut();
                    }, 3000)
                } else {
                    if (response.error) {
                        return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                    }
                    else if (response.success) {
                        setData({ data: newDays });
                        setLoading(false)
                        setDialogOpen(false);
                    }
                    else {
                        setAllert({ ...allert, open: true, type: 'info', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
                    }
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Dialog
                open={dialogOpen === day._id ? true : false}
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> <span style={{ color: 'orangered' }}>WARNING! </span> Are you sure you want to delete this day?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={loading ? {textAlign: 'center'} : {}}>
                        {loading ? <ColorCircularProgress size={24} thickness={4} /> : (
                            <>
                                <span>{new Date(day.date).toLocaleDateString()}</span><br />
                                <span style={{ fontSize: '12px', color: 'gray', fontStyle: 'italic' }}>from</span> {day.startHarbor} <span style={{ fontSize: '12px', color: 'gray', fontStyle: 'italic' }}>  to</span> {day.endHarbor}
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>
                        <span style={{ color: 'rgb(46,128,233)'}}>No</span>
                    </Button>
                    <Button onClick={ ()=>deleteDay(day)} color="primary" autoFocus disabled={loading}>
                        <span style={{ color: 'orangered' }}>Yes</span>
                    </Button>
                </DialogActions>
            </Dialog>
            <Allert
                allert={allert}
                setAllert={setAllert} />
        </>
     );
}

export default BeforeCancelComponent;

const ColorCircularProgress = withStyles({
    root: {
        color: 'orangered',
        width: '24px',
        height: '24px',
    },
})(CircularProgress);