import React from 'react';
import firebase from '../Firebase';

const LogOutButton = () => {

    //const auth = firebase.auth();

    return (
        <button type="button" onClick={firebase.auth().signOut()}>
            Log Out
        </button>
    )
};
export default LogOutButton;