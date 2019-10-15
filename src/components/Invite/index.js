import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import * as firebase from 'firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";

const Invite = () => {

    const db = firebase.firestore();
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState("");

    const handleInputChange = (event) => {
        //Adds new value
        setFormValues({...formValues, [event.target.name]: event.target.value});
    };

    // add emails into authEmails in firebase as an array
    const  inviteUser = (event) => {
        event.preventDefault();
        db.collection("authEmails")
            .doc("emails")
            .update({
                emails: firebase.firestore.FieldValue.arrayUnion(formValues.email)
            })
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

        <Grid container
              direction="column"
              justify="space-around"
              alignItems="center"
              spacing={4}>
            <h1>Invite User</h1>
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
    )
};
export default Invite;