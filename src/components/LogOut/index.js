import React from 'react';
import firebase from '../Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const LogOutButton = () => {

    const useStyles = makeStyles(theme => ({
        button: {
            margin: theme.spacing(1),
        },
        input: {
            display: 'none',
        },
    }));

    const classes = useStyles();

    return (
        // Logout user when the button is clicked
        <Button className={classes.button} fullWidth={true} variant={'outlined'} onClick={() => firebase.auth().signOut()}>
            Log Out
        </Button>
    )
};
export default LogOutButton;