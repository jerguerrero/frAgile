import React, { useState } from 'react'
import * as firebase from 'firebase'
import Grid from '@material-ui/core/Grid'
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore'
import 'react-table/react-table.css'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Infinite from 'react-infinite'
import ListItem from '@material-ui/core/ListItem'
import './artifact.css'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes, faUserLock } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { get } from 'lodash'
library.add(faUserTimes, faUserLock)

const ArtifactManagement = (user) => {
  console.log(user)

  const db = firebase.firestore()

  const [currentDocument, setCurrentDocument] = useState({})
  const [currentArtifactID, setCurrentArtifactID] = useState(' ')
  const [currentImage, setCurrentImage] = useState(null)
  const [currentDocumentRef, setCurrentDocumentRef] = useState(null)
  const [currentImages, setCurrentImages] = useState(null)

  const [artifacts, artifactsLoading, artifactsError] = useCollection(
    db.collection('artifacts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  const [likes, likesLoading, likesError] = useCollection(
    db
      .collection('artifacts')
      .doc(currentArtifactID)
      .collection('likes'),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )

  // Change owner registered for the artifact on the databse
  const passDownArtifact = (event) => {
    currentDocumentRef.set({ owner: event.target.value }, { merge: true })
    alert('OWNER CHANGED')
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

  // Get all document of likes for a particular document if it exist
  let num1
  if (likes && !likes.empty) {
    num1 = likes.docs
    num1.map((document) => {
    })
  }

  return (
    <div id={'homecontainer'}>
      <h1 id={'passDownArtifact'} align={'center'}>
        Pass Down Artifact
      </h1>

      {/*Image panel*/}
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid id={'middlepane'} style={{ position: 'relative' }} item xs={12} sm={8}>
          <Grid item xs={12}>
            <CardMedia id={'middlepaneimage'} component="img" image={currentImage} />

            <IconButton
              disabled={true}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '50px',
                height: '50px',
                border: 'solid',
                borderRadius: '200%',
                backgroundColor: '#E7E3E1'
              }}
            >
              <FontAwesomeIcon
                icon={
                  get(currentDocument, 'owner', false) ? 'user-lock' : 'user-times'
                }
                color={'#F87531'}
              />
            </IconButton>
          </Grid>

          <Grid
            container
            xs={12}
            style={{ textAlign: 'left', position: 'relative' }}
          >
            {/*Button to go the left image*/}
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

            {/*Button to go the right image*/}
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

        {/*Artifact list*/}
        <Grid container justify="space-evenly" xs={12} sm={3}>
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
                maxHeight: 200
              }}
            >
              {(() => {
                if (artifacts) {
                  // Change this into artifacts that has subcollection 'likes' only
                  return artifacts.docs.map((document) => {
                    return (
                      <ListItem
                        button
                        onClick={() => {
                          setCurrentImage(document.data().imageUrl[0])
                          setCurrentImages(document.data().imageUrl)
                          setCurrentDocument(document.data())
                          setCurrentArtifactID(document.id)
                          setCurrentDocumentRef(document.ref)
                        }}
                      >
                        {document.data().Name}
                      </ListItem>
                    )
                  })
                }
              })()}
            </List>
          </Grid>

          {/*Artifact Descriptions*/}
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

      {/*Inheritance candidate/User who likes the artifacts*/}
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid item xs={12} sm={8} style={{ marginTop: '10px' }}>
          <Card>
            <CardHeader
              style={{ textAlign: 'center' }}
              title="Inheritance Candidate"
            />
          </Card>
          <Infinite containerHeight={200} elementHeight={60}>
            {(() => {
              if (likes && !likes.empty) {
                return num1.map((document) => {
                  return (
                    <ListItem>
                      <Grid container xs={12}>
                        <Grid container xs={12}>
                          <Grid item xs={2} style={{ fontWeight: 700 }}>
                            {document.data().name
                              ? document.data().name
                              : 'Anonymous'}
                          </Grid>
                          <Grid item xs={1} style={{ maxWidth: '10px' }}></Grid>
                          <Grid
                            item
                            xs={9}
                            style={{ fontWeight: 300, fontSize: 11 }}
                          >
                            {(() => {
                              if (
                                get(currentDocument, 'owner', null) ===
                                document.data().uid
                              ) {
                                return <div>{'CURRENT OWNER'}</div>
                              } else {
                                return (
                                  <button
                                    value={document.data().uid}
                                    onClick={(event) => passDownArtifact(event)}
                                  >
                                    {'Pass Down'}
                                  </button>
                                )
                              }
                            })()}
                            {}
                          </Grid>
                        </Grid>
                        <Grid item xs={4}>
                          {document.data().reason}
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
export default ArtifactManagement
