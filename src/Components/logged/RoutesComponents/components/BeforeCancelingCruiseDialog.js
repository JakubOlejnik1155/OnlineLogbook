import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { CircularProgress, withStyles } from '@material-ui/core';


import { DeleteRequestFunction, unauthorizedLogOut } from '../constants/functions';
import AuthApi from '../../../../authAPI';
import Allert from './Allert';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BeforeCancelingCruiseDialog = ({ cruise, dialogOpen, setCruiseDialogOpen, setCruisesArray, cruisesArray }) => {
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
        setCruiseDialogOpen(false)
    };
    const deleteCruise = (cruise) => {
        setLoading(true);
        const newCruisesArray = cruisesArray.data.filter((element) => element._id !== cruise._id);
        DeleteRequestFunction(`/api/cruises/${cruise._id}`)
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
                        setCruisesArray({ data: newCruisesArray });
                        setLoading(false)
                        setCruiseDialogOpen(false);
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
                open={dialogOpen === cruise._id ? true : false}
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> <span style={{ color: 'orangered' }}>WARNING! </span> Are you sure you want to delete this cruise?</DialogTitle>
                <DialogContent style={loading ? { textAlign: 'center' } : {}}>
                    {loading ? <ColorCircularProgress size={24} thickness={4} /> : (
                            <>
                                <span>{new Date(cruise.startDate).toLocaleDateString()}</span><br />
                                <span style={{  color: 'black', fontStyle: 'italic' }}>{cruise.country}</span>,
                                <span style={{  color: 'gray', fontStyle: 'italic' }}>{" "+cruise.sailingArea}</span>

                            </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>
                        <span style={{ color: 'rgb(46,128,233)' }}>No</span>
                    </Button>
                    <Button onClick={() => deleteCruise(cruise)} color="primary" autoFocus disabled={loading}>
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

export default BeforeCancelingCruiseDialog;

const ColorCircularProgress = withStyles({
    root: {
        color: 'orangered',
        width: '24px',
        height: '24px',
    },
})(CircularProgress);