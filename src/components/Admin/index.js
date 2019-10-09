import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import firebase from '../Firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";
import moment from "../Home";
import {useCollection} from "react-firebase-hooks/firestore";

const Admin = () => {

    const db = firebase.firestore();
    const auth = firebase.auth();
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState("");

    const handleInputChange = (event) => {
        //Adds new value
        setFormValues({...formValues, [event.target.name]: event.target.value});
    };

    const  inviteUser = (event) => {
        event.preventDefault();
        var authEmail = formValues;
        console.log(authEmail);
        db.collection("authEmails")
            .add(authEmail)
            .then(() => {
                formValues.email = "";
                console.log("Successfuly invited");
                alert.show('User Successfully Invited!')
            })
            .catch( error => {
                console.log(error);
            });

    };

    return (
        <div>
            <Grid container
                  direction="column"
                  justify="space-around"
                  alignItems="center"
                  spacing={4}>
                <h1>Admin Page</h1>
                <form onSubmit={event => inviteUser(event)}>
                    {'Invite user via email: '}
                    <br/>
                    <input
                        name="email"
                        value={formValues.email}
                        onChange={event => handleInputChange(event)}
                        type="text"
                        placeholder="Type user email address here"
                    />
                    <br/>
                    <button type="submit">
                        Invite
                    </button>
                </form>
            </Grid>
        </div>
    )
};
export default Admin;