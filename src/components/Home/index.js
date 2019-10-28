import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import firebase from '../Firebase/index.js'
import Grid from '@material-ui/core/Grid'
import Infinite from 'react-infinite'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React, { useState } from 'react'
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore'
import TextField from '@material-ui/core/TextField'
import './home.css'
import moment from 'moment'
import {
  faCaretLeft,
  faCaretRight,
  faThumbsUp,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@material-ui/core/IconButton'
import Upload from '../Upload'
import Modal from '@material-ui/core/Modal'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core'
import { get } from 'lodash'
import Image from 'material-ui-image'
library.add(faCaretLeft, faCaretRight, faThumbsUp, faPlusCircle)

const Home = (user) => {

  const db = firebase.firestore()

  const [currentDocument, setCurrentDocument] = useState({})
  const [currentArtifactID, setCurrentArtifactID] = useState(' ')
  const [currentImage, setCurrentImage] = useState(null)
  const [currentDocumentRef, setCurrentDocumentRef] = useState(null)
  const [comment, setComment] = useState('')
  const [currentImages, setCurrentImages] = useState(null)
  const [openUploadForm, setOpenUploadForm] = useState(false)
  const [openLikeForm, setOpenLikeForm] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  // State for for form values
  const [formValues, setFormValues] = useState(['', ''])

  const isInvalid = formValues.reason === undefined || formValues.reason === ''

  const handleInputChange = (event) => {
    //Adds new value
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  const [artifacts, artifactsLoading, artifactsError] = useCollection(
    db.collection('artifacts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  const [comments, commentsLoading, commentsError] = useCollection(
    db
      .collection('artifacts')
      .doc(currentArtifactID)
      .collection('comments'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  const [userInfo, userInfoLoading, userInfoError] = useDocumentData(
    db.collection('users').doc(user.user ? user.user.uid : 'dd'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  }))

  const classes = useStyles()

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const submitComment = () => {
    if (comment) {
      currentDocumentRef
        .collection('comments')
        .add({
          user: user.user.displayName,
          uid: user.user.uid,
          comment,
          timestamp: Number(new Date().getTime())
        })
        .then(() => {
          console.log('Successfuly saved')
          setComment('')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const handleOpenUploadForm = () => {
    if (openUploadForm) {
      setOpenUploadForm(false)
    } else {
      setOpenUploadForm(true)
    }
  }

  // open like popup
  const handleLikeOpen = () => {
    setOpenLikeForm(true)
  }

  // close popup when button is pressed
  const handleLikeClose = () => {
    setOpenLikeForm(false)
  }

  let button

  if (comment.length > 0) {
    button = <button onClick={submitComment}>{'Comment'}</button>
  } else {
    button = null
  }

  /* choose larger function to re-arrange comments */
  let chooselarger = (m, n) => {
    let temp1 = m.data().timestamp
    let temp2 = n.data().timestamp

    /* if else statement that does the actual comparing */
    if (temp1 > temp2) {
      return -1
    } else if (temp1 < temp2) {
      return 1
    } else if (temp1 === temp2) {
      return 0
    } else {
      return 0
    }
  }
  let num1
  if (comments && !comments.empty) {
    num1 = comments.docs

    /* sort */
    num1.sort(chooselarger)
  }

  // Change image to the image to the left
  const navigateImageLeft = () => {
    var indexOfImage = currentImages.indexOf(currentImage)
    if (indexOfImage >= 1) {
      setCurrentImage(currentImages[indexOfImage - 1])
    }
  }

  // Change image to the image to the right
  const navigateImageRight = () => {
    var indexOfImage = currentImages.indexOf(currentImage)
    if (indexOfImage < currentImages.length - 1) {
      setCurrentImage(currentImages[indexOfImage + 1])
    }
  }

  // Add like to the database and store it as a subcollection inside current artifact
  const addLike = (event) => {
    // Record user like and reasoning
    db.collection('artifacts')
      .doc(currentArtifactID)
      .collection('likes')
      .add({
        name: user.user.displayName,
        timestamp: new Date(),
        email: user.user.email,
        uid: user.user.uid,
        reason: formValues.reason
      })
      .then(() => {
        handleLikeClose()
      })
    event.preventDefault()
  }

  // open upload form popout when the plus button is clicked
  const addPhotoButton = () => {
    // Only admin/Helen can see and use the button
    if (get(user, 'user.uid', false) === '4KuxRhxmTdesil7mUMe2F0oqQD22') {
      return (
        <div style={{ textAlign: 'right' }}>
          <IconButton
            style={{ marginTop: '-70px', position: 'relative' }}
            onClick={() => handleOpenUploadForm()}
          >
            <FontAwesomeIcon icon="plus-circle" color={'#F87531'} />
          </IconButton>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div id={'homecontainer'}>
      {(() => {
        if (openUploadForm) {
          return (
            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              open={openUploadForm}
            >
              <Upload handleOpenUploadForm={setOpenUploadForm} />
            </Modal>
          )
        }
      })()}

      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid id={'middlepane'} style={{ position: 'relative' }} item xs={12} sm={8}>
          <Grid item xs={12}>
            <Image
              id={'middlepaneimage'}
              src={currentImage || ''}
              style={{
                backgroundColor: '#E7E3E1',
                paddingTop: '63vh',
                objectFit: 'contain'
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', position: 'relative' }}>
            {/*like popup open when the 'like' button is clicked*/}
            <IconButton
              onClick={handleLikeOpen}
              style={{
                position: 'absolute',
                bottom: '10px',
                width: '50px',
                height: '50px',
                border: 'solid',
                borderRadius: '200%',
                backgroundColor: '#E7E3E1'
              }}
            >
              <FontAwesomeIcon icon="thumbs-up" color={'#F87531'} />
            </IconButton>

            <div
              style={{
                position: 'absolute',
                width: '96%',
                height: '50px',
                textAlign: 'right'
              }}
            >
              {currentImages
                ? 'Photo ' +
                  (currentImages.indexOf(currentImage) + 1) +
                  '/' +
                  currentImages.length
                : null}
            </div>
            <Modal
              id={'likeModal'}
              aria-labelledby="like-modal-title"
              aria-describedby="like-modal-description"
              className={classes.modal}
              open={openLikeForm}
              onClose={handleLikeClose}
            >
              <div id={'likePopUp'}>
                <Grid
                  container
                  direction="column"
                  justify="space-around"
                  alignItems="center"
                  spacing={4}
                >
                  <h2 id="like-modal-title">
                    Why would you like to inherit this artifact?
                  </h2>
                  <form onSubmit={addLike}>
                    {'Reason: '}
                    <br />
                    <textarea
                      name="reason"
                      value={formValues.reason}
                      onChange={(event) => handleInputChange(event)}
                      rows={10}
                      type="text"
                      placeholder="Right your reason here"
                    />
                    <br />
                    <button disabled={isInvalid} type="submit">
                      Submit
                    </button>
                  </form>
                </Grid>
              </div>
            </Modal>
          </Grid>
          <Grid
            item={true}
            container
            xs={12}
            style={{ textAlign: 'left', position: 'relative' }}
          >
            <Grid item xs={1}>
              <IconButton
                style={{ textAlign: 'left', position: 'relative', bottom: '35vh' }}
                onClick={() => {
                  navigateImageLeft()
                }}
              >
                <FontAwesomeIcon
                  icon="caret-left"
                  style={{ width: '20px' }}
                  color={'white'}
                />
              </IconButton>
            </Grid>
            <Grid item xs={10}></Grid>
            <Grid item xs={1} style={{ textAlign: 'right' }}>
              <IconButton
                style={{ textAlign: 'left', position: 'relative', bottom: '35vh' }}
                onClick={() => {
                  navigateImageRight()
                }}
              >
                <FontAwesomeIcon
                  style={{ width: '20px' }}
                  icon="caret-right"
                  color={'white'}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item={true} container justify="space-evenly" xs={12} sm={3}>
          <Grid id="rightpanelist" item xs={12} md={12}>
            <Card>
              <CardHeader style={{ textAlign: 'center' }} title="Artifacts" />
            </Card>

            <List
              style={{
                width: '100%',
                maxWidth: 360,
                position: 'relative',
                overflow: 'auto',
                maxHeight: 200,
                height: 200
              }}
            >
              {(() => {
                if (artifacts) {
                  return artifacts.docs.map((document) => {
                    return (
                      <ListItem
                        key={document.data().imageUrl}
                        button
                        onClick={() => {
                          setImageLoading(true)
                          setCurrentImage(document.data().imageUrl[0])
                          setCurrentImages(document.data().imageUrl)
                          setCurrentDocument(document.data())
                          setCurrentArtifactID(document.id)
                          setCurrentDocumentRef(document.ref)
                          setImageLoading(false)
                        }}
                      >
                        {document.data().Name}
                      </ListItem>
                    )
                  })
                }
              })()}
            </List>
            {addPhotoButton()}
          </Grid>
          <Grid id={'leftpanelist'} item xs={12} md={12}>
            <Card>
              <CardHeader style={{ textAlign: 'center' }} title="Description" />
            </Card>
            <List
              style={{
                width: '100%',
                maxWidth: 360,
                position: 'relative',
                overflow: 'auto',
                maxHeight: 200
              }}
            >
              {Object.keys(currentDocument).map((key) => {
                if (key === 'imageUrl' || key === 'owner') {
                  return null
                } else {
                  return (
                    <ListItem>
                      <ListItemText primary={key} secondary={currentDocument[key]} />
                    </ListItem>
                  )
                }
              })}
            </List>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid item xs={12} sm={8}>
          <TextField
            id="standard-full-width"
            style={{ margin: 8 }}
            placeholder="Comment"
            helperText={button}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={(event) => handleCommentChange(event)}
            value={comment}
          />
        </Grid>
        <Grid item xs={12} sm={3} />
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid item xs={12} sm={8}>
          <Infinite containerHeight={200} elementHeight={60}>
            {(() => {
              if (comments && !comments.empty) {
                return num1.map((document) => {
                  return (
                    <ListItem>
                      <Grid container xs={12}>
                        <Grid item={true} container xs={12}>
                          <Grid item xs={2} style={{ fontWeight: 700 }}>
                            {document.data().user
                              ? document.data().user
                              : 'Anonymous'}
                          </Grid>
                          <Grid item xs={1} style={{ maxWidth: '10px' }}></Grid>
                          <Grid
                            item
                            xs={9}
                            style={{ fontWeight: 300, fontSize: 11 }}
                          >
                            {moment(
                              Number(
                                new Date(document.data().timestamp)
                                  .getTime()
                                  .toString()
                              )
                            ).format('DD/MM/YY, h:mm:ss a')}
                          </Grid>
                        </Grid>
                        <Grid item xs={4}>
                          {document.data().comment}
                        </Grid>
                      </Grid>
                    </ListItem>
                  )
                })
              }
            })()}
          </Infinite>
        </Grid>
        <Grid item xs={12} sm={3} />
      </Grid>
    </div>
  )
}
export default Home
