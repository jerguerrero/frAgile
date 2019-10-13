import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import * as firebase from 'firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";
import moment from "../Home";
import {useCollection} from "react-firebase-hooks/firestore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

        <Grid id={"adminContainer"}>
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={4}>

            <Grid id={"sideNavigation"} style={{position: 'relative'}} item xs={3}>
                <Grid container
                      direction="column"
                      justify="flex-start"
                      alignItems="flex-start"
                      spacing={2}>
                    <Grid item>
                        <Link to="/">Test1</Link>
                    </Grid>
                    <Grid item>
                        <Link to="/">Test2</Link>
                    </Grid>
                </Grid>
            </Grid>

            <Grid id={"userInvite"}>
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
            </Grid>

        </Grid>
        </Grid>
    )
};
export default Admin;