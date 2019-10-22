import React from 'react';
import firebase from '../Firebase';
import {Link} from "react-router-dom";

const LogOutButton = () => {

    return (
        <Link to="/" class={"button"} onClick={() => firebase.auth().signOut()}>
            Log Out
        </Link>
    )
};
export default LogOutButton;