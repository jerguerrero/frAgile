import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import {useAlert} from "react-alert";

const Login = () => {

    const db = firebase.firestore();
    const auth = firebase.auth();
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState({});
    // State for extra input fields
    const [fields, setFields] = useState(["Email", "Password"]);

    const handleInputChange = (event) => {
        //Adds new value
        setFormValues({...formValues, [event.target.name]: event.target.value});
    };

    const isInvalid = formValues.password === '' || formValues.email === '';

    const  loginUser = (event) => {
        auth.signInWithEmailAndPassword(formValues.email, formValues.password)
            .then(() => {
                // Make the fields to their original state
                setFormValues({});
                setFields(["Email", "Password"]);

                // Go to homepage when user are signed up
            })
            .catch(error => {
                //do something
                var errorCode = error.code;
                var errorMessage = error.message;

                if(errorCode == 'auth/invalid-email'){
                    alert.show('This email is not valid');
                }else if(errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password'){
                    alert.show('This email or password is not correct');
                }else{
                    alert.show(errorMessage);
                }

                console.log(error);
            });
        event.preventDefault();
    };

    return (
        <div>
            <form onSubmit={event => loginUser(event)}>
                <input
                    name="email"
                    value={formValues.email}
                    onChange={event => handleInputChange(event)}
                    type="text"
                    placeholder="Email Address"
                />
                <br/>
                <br/>
                <input
                    name="password"
                    value={formValues.password}
                    onChange={event => handleInputChange(event)}
                    type="password"
                    placeholder="Password"
                />
                <br/>
                <br/>
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
            </form>
        </div>
    )
};
export default Login;