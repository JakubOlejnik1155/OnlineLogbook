import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    GridContainer: {
        width: '100%',
        margin: 0,
    },
    noBottomMargin: {
        marginBottom: 0,
        padding: '0px !important'
    },
    paper: {
        padding: "1vw",
        textAlign: "center",
        color: "black",
        whiteSpace: "wrap",
        background: "rgba(255, 255, 255, .9)",
    },
    buttonBgc: {
        backgroundColor: 'rgb(66,133,235)',
        '&:hover': {
            backgroundColor: 'rgb(26,107,230)',
        },
    },
    backdrop: {
        marginTop: '60px',
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        '& .MuiCircularProgress-root': {
            width: '70px !important',
            height: '70px !important',
        }
    },
    rowOfColumnGrid:{
        width: '80%',
        maxWidth: '400px',
    },
    textAlignLeft:{
        textAlign: 'left',
    },
    GPSInput: {
        padding: '6px',
        fontSize: '16px',
        border: '2px solid rgb(66,133,235)',
        borderRadius: '5px',
        outline: 'none',
        width: '100%',
        maxWidth: '275px',
        backgroundColor: 'transparent',
    }

}));


export const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(66,133,235)',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(66,133,235)',
                borderWidth: 1.5,

            },
            '&:hover fieldset': {
                borderColor: 'rgb(66,133,235)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(66,133,235)',
            },
        },
    },
})(TextField);