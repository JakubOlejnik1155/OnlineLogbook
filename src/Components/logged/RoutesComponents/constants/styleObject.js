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
    dangerButton:{
        backgroundColor: 'rgb(231,87,23)',
        '&:hover': {
            backgroundColor: 'rgb(231,87,23)',
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
    },
    root: {
        maxWidth: '100%',
        '& .MuiCardHeader-title':{
            fontSize: '18px',
        },
        '& .MuiCardHeader-subheader': {
            fontSize: '16px',
        },
        '& .MuiCardContent-root': {
            paddingBottom: 0,
        },
        '& .MuiCardActions-root':{
            paddingTop: 0,
        }
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: "rotate(180deg)"
    },
    avatar: {
        backgroundColor: 'navy'
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