import React, { Component, useState } from 'react'
import * as firebase from 'firebase'
import { useAlert } from 'react-alert'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const Invite = () => {
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      backgroundColor: theme.palette.common.white
    },
    dense: {
      marginTop: theme.spacing(2)
    },
    menu: {
      width: 200
    }
  }))

  const classes = useStyles()

  const db = firebase.firestore()
  const alert = useAlert()

  // State for for form values
  const [formValues, setFormValues] = useState('')

  // Record changes in the email input
  const handleInputChange = (event) => {
    //Adds new value
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  // add emails into authEmails in firebase as an array
  const inviteUser = (event) => {
    event.preventDefault()
    db.collection('authEmails')
      .doc('emails')
      .update({
        emails: firebase.firestore.FieldValue.arrayUnion(formValues.email)
      })
      .then(() => {
        formValues.email = ''
        console.log('Successfuly invited')
        alert.show('User Successfully Invited!')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Grid
      container
      direction="column"
      justify="space-around"
      alignItems="center"
      spacing={4}
    >
      <h1>Invite User</h1>
      <form className={classes.container} onSubmit={(event) => inviteUser(event)}>
        {'Invite user via email: '}
        <TextField
          id="outlined-email-input"
          label="Email"
          className={classes.textField}
          fullWidth={true}
          type="email"
          name="email"
          autoComplete="email"
          value={formValues.email}
          onChange={(event) => handleInputChange(event)}
          type="text"
          placeholder="Type user email address here"
          margin="normal"
          variant="outlined"
        />
        <br />
        <button type="submit">Invite</button>
      </form>
    </Grid>
  )
}
export default Invite
