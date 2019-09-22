import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import {useAlert} from "react-alert";
import { Redirect } from 'react-router-dom';
import Grid from "@material-ui/core/Grid";

const SignUpPage = (props) => {

    const db = firebase.firestore();
    const auth = firebase.auth();
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState({});
    // State for extra input fields
    const [fields, setFields] = useState(["Username", "Email", "Password", "Confirm Password"]);
    const [signUpStatus, setSignUpStatus] = useState(false);

    const isInvalid =
        formValues.passwordOne !== formValues.passwordTwo ||
        formValues.passwordOne === '' ||
        formValues.email === '' ||
        formValues.username === '' ||
        formValues.username === undefined ||
        formValues.email === undefined ||
        formValues.passwordOne === undefined;

    const handleInputChange = (event) => {
        //Adds new value
        setFormValues({...formValues, [event.target.name]: event.target.value});
    };

    const renderRedirect = () => {
        if(signUpStatus){
            return <Redirect to='/' />
        }
        else{
            return null;
        }
    }

    const registerUser = (event) => {
        event.preventDefault();
        console.log(formValues.email);
        console.log(formValues.passwordOne);

        auth.createUserWithEmailAndPassword(formValues.email, formValues.passwordOne)
            .then(authUser => {
                // Make the fields to their original state
                setFormValues({});
                setFields(["Username", "Email", "Password", "Confirm Password"]);

                // Go to homepage when user are signed up
                setSignUpStatus(true);

            })
            .catch(error => {
                //do something
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/weak-password') {
                    alert.show('The password should be at least 6 characters');
                }

                if(errorCode == 'auth/email-already-in-use'){
                    alert.show('This email is already in used');
                }

                // Need to update this so that only authorized email (by admin) is considered valid
                if(errorCode == 'auth/invalid-email'){
                    alert.show('This email is not authorized, contact admin');
                }

                console.log(error);
            });
    }


    return (
        <div>
            {renderRedirect()}
            <Grid container
                  direction="column"
                  justify="space-around"
                  alignItems="center"
                  spacing={4}>
            <h1>SignUp</h1>
            <form onSubmit={event => registerUser(event)}>
                {'Name: '}
                <br/>
                <input
                    name="username"
                    value={formValues.username}
                    onChange={event => handleInputChange(event)}
                    type="text"
                    placeholder="Full Name"
                />
                <br/>
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
                    name="passwordOne"
                    value={formValues.passwordOne}
                    onChange={event => handleInputChange(event)}
                    type="password"
                    placeholder="Password"
                />
                <br/>
                {'Repeat Password: '}
                <br/>
                <input
                    name="passwordTwo"
                    value={formValues.passwordTwo}
                    onChange={event => handleInputChange(event)}
                    type="password"
                    placeholder="Confirm Password"
                />
                <br/>
                <button disabled={isInvalid} type="submit">Sign Up</button>
                {/*{error && <p>{error.message}</p>}*/}
            </form>
            </Grid>
        </div>
    )
};

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to="/SignUp">Sign Up</Link>
    </p>
);
export default SignUpPage;

