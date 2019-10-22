import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import firebase from '../Firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";

const Login = () => {

    const db = firebase.firestore();
    const auth = firebase.auth();
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState(["", ""]);
    // State for extra input fields
    const [fields, setFields] = useState(["Email", "Password"]);
    const [signUpStatus, setSignUpStatus] = useState(false);

    // Login is invalid if email and password is empty
    const isInvalid = formValues.password === undefined || formValues.email === undefined ||
        formValues.password === '' || formValues.email === '';

    // Record changes in the input
    const handleInputChange = (event) => {
        //Adds new value
        setFormValues({...formValues, [event.target.name]: event.target.value});
    };

    // Redirect page to home after user logged in
    const renderRedirect = () => {
        if(signUpStatus){
            return <Redirect to='/' />
        }
        else{
            return null;
        }
    }

    // Check user email and password and login user if it matched the firebase authenticaion
    const  loginUser = (event) => {
        auth.signInWithEmailAndPassword(formValues.email, formValues.password)
            .then(() => {
                // Make the fields to their original state
                setFormValues({});
                setFields(["Email", "Password"]);

                // Go to homepage when user are signed up
                setSignUpStatus(true);
            })
            .catch(error => {
                // Show login error to user
                var errorCode = error.code;
                var errorMessage = error.message;

                if(errorCode == 'auth/invalid-email'){
                    alert.show('This email is not valid');
                }else if(errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password'){
                    alert.show('This email or password is not correct');
                }else{
                    alert.show(errorMessage);
                }

            });
        event.preventDefault();
    };

    return (
        <div >
            {renderRedirect()}
            <Grid container
                  id={"loginModal"}
                  direction="column"
                  justify="space-around"
                  alignItems="center"
                  spacing={4}>
            <form onSubmit={event => loginUser(event)}>
                {'Email: '}
                <br/>
                <input
                    name="email"
                    value={formValues.email}
                    onChange={event => handleInputChange(event)}
                    type="text"
                    placeholder="Email Address"
                />
                <br/>
                {'Password: '}
                <br/>
                <input
                    name="password"
                    value={formValues.password}
                    onChange={event => handleInputChange(event)}
                    type="password"
                    placeholder="Password"
                />
                <br/>
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
            </form>
            </Grid>
        </div>
    )
};
export default Login;