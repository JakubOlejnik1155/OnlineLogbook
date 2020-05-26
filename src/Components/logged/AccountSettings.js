import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import {useStyles} from './RoutesComponents/constants/styleObject';

const AccountSettings = () => {
    const classes = useStyles();
    return (
        <div style={{width: '100%', height: 'calc(100% -60px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Paper className={classes.paper} >
                <Typography variant="h5" style={{letterSpacing: '2px'}}>
                    Here You will be able to manage your account. <br />
                </Typography>
                <Typography color="primary"variant="overline" style={{fontSize: '32px', fontStyle: 'italic'}}>Stay tuned! <span role="img" aria-label="surf connection">⚓️⛵️</span> </Typography>
            </Paper>
        </div>
     );
}

export default AccountSettings;