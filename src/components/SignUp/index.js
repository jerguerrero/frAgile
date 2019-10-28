import React, { useState } from 'react'
import firebase from '../Firebase'
import { useAlert } from 'react-alert'
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { useDocument } from 'react-firebase-hooks/firestore'

const SignUpPage = (props) => {
  const db = firebase.firestore()
  const ref = firebase.database().ref('authEmails')
  const auth = firebase.auth()
  const alertAlternative = useAlert()

  // State for for form values
  const [formValues, setFormValues] = useState({})
  // State for extra input fields
  const [fields, setFields] = useState([
    'Username',
    'Email',
    'Password',
    'Confirm Password'
  ])
  const [signUpStatus, setSignUpStatus] = useState(false)

  const [authEmails, authEmailsLoading, authEmailsError] = useDocument(
    db.collection('authEmails').doc('emails'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  // Form is invalid is the passwords doesn't match or there is an empty field
  const isInvalid =
    formValues.passwordOne !== formValues.passwordTwo ||
    formValues.passwordOne === '' ||
    formValues.email === '' ||
    formValues.username === '' ||
    formValues.username === undefined ||
    formValues.email === undefined ||
    formValues.passwordOne === undefined

  // Record changes in the input
  const handleInputChange = (event) => {
    //Adds new value
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  // Redirect the page to home after user has signup successfully
  const renderRedirect = () => {
    if (signUpStatus) {
      return <Redirect to="/" />
    } else {
      return null
    }
  }

  // Register user to the firebase authentication and database if they are registered successfully
  const registerUser = (event) => {
    event.preventDefault()

    // Only register user if they have been invited/authorised by admins
    if (authEmails.data().emails.includes(formValues.email)) {
      // Create user in firebase authentication
      auth
        .createUserWithEmailAndPassword(formValues.email, formValues.passwordOne)
        .then((authUser) => {
          // Store user information in firebase database
          var user = {
            Name: formValues.username,
            Email: formValues.email
          }

          if (authUser) {
            authUser.user
              .updateProfile({
                displayName: formValues.username
              })
              .then(alert)
              .catch(alert)
          }

          db.collection('users')
            .doc(authUser.user.uid)
            .set(user)
            .then(() => {
              alert('User Successfully Created')
            })
            .catch((error) => {
              alert(error)
            })

          // Make the fields to their original state
          setFormValues({})
          setFields(['Username', 'Email', 'Password', 'Confirm Password'])

          // Go to homepage when user are signed up
          setSignUpStatus(true)
        })
        .catch((error) => {
          // Alert users on error
          var errorCode = error.code
          var errorMessage = error.message

          if (errorCode == 'auth/weak-password') {
            alertAlternative.show('The password should be at least 6 characters')
          }

          if (errorCode == 'auth/email-already-in-use') {
            alertAlternative.show('This email is already in used')
          }

          // Need to update this so that only authorized email (by admin) is considered valid
          if (errorCode == 'auth/invalid-email') {
            alertAlternative.show('This email is not authorized, contact admin')
          }

          console.log(error)
        })
    } else {
      alert('The email is not authorized to sign up please contact admin')
    }
  }

  return (
    <div>
      {renderRedirect()}
      <Grid
        container
        id={'loginModal'}
        direction="column"
        justify="space-around"
        alignItems="center"
        spacing={4}
      >
        <form onSubmit={(event) => registerUser(event)}>
          {'Display Name: '}
          <br />
          <input
            name="username"
            value={formValues.username}
            onChange={(event) => handleInputChange(event)}
            type="text"
            placeholder="Username"
          />
          <br />
          {'Email: '}
          <br />
          <input
            name="email"
            value={formValues.email}
            onChange={(event) => handleInputChange(event)}
            type="text"
            placeholder="Email Address"
          />
          <br />
          {'Password: '}
          <br />
          <input
            name="passwordOne"
            value={formValues.passwordOne}
            onChange={(event) => handleInputChange(event)}
            type="password"
            placeholder="Password"
          />
          <br />
          {'Repeat Password: '}
          <br />
          <input
            name="passwordTwo"
            value={formValues.passwordTwo}
            onChange={(event) => handleInputChange(event)}
            type="password"
            placeholder="Confirm Password"
          />
          <br />
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>
          {/*{error && <p>{error.message}</p>}*/}
        </form>
      </Grid>
    </div>
  )
}

export default SignUpPage
