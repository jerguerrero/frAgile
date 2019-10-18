import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import firebase from '../Firebase/index.js';
import Grid from '@material-ui/core/Grid';
import Infinite from "react-infinite";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, {useState} from 'react';
import { useCollection, useDocumentData} from 'react-firebase-hooks/firestore';
import TextField from '@material-ui/core/TextField';
import './home.css';
import moment from "moment";
import {faCaretLeft, faCaretRight, faThumbsUp, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from '@material-ui/core/IconButton';
import  Upload  from '../Upload';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
library.add(faCaretLeft, faCaretRight, faThumbsUp, faPlusCircle);

const Home = (user) => {
    console.log(user);

    const db = firebase.firestore();

    const [currentDocument, setCurrentDocument] = useState({});
    const [currentArtifactID, setCurrentArtifactID] = useState(" ");
    const [currentImage, setCurrentImage] = useState(null);
    const [currentDocumentRef, setCurrentDocumentRef] = useState(null);
    const [comment, setComment] = useState("");
    const [currentImages, setCurrentImages] = useState(null);
    const [openUploadForm, setOpenUploadForm] = useState(false);

    const [artifacts, artifactsLoading, artifactsError] = useCollection(
        db.collection('artifacts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [comments, commentsLoading, commentsError] = useCollection(
        db.collection('artifacts')
            .doc(currentArtifactID)
            .collection("comments"),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [userInfo, userInfoLoading, userInfoError] = useDocumentData(
        db.collection('users')
            .doc(user.user? user.user.uid : 'dd'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleCommentChange = (event) =>{
        setComment(event.target.value);
    };

    const submitComment = () =>{
        if(comment){
            currentDocumentRef.collection("comments")
                .add({user: user.user.displayName, uid: user.user.uid ,comment, timestamp: Number(new Date().getTime())})
                .then(() => {
                    console.log("Successfuly saved");
                    setComment("");
                })
                .catch( error => {
                    console.log(error);
                });
        }
    };

    const handleOpenUploadForm = () => {
        if(openUploadForm){
            setOpenUploadForm(false);
        }
        else{
            setOpenUploadForm(true);
        }
    };

    let button;

    if (comment.length > 0) {
        button =
            <button
            onClick={submitComment}>
            {"Comment"}
            </button>;
    } else {
        button = null;
    }

    /* choose larger function to re-arrange comments */
    let chooselarger = (m, n) => {
        let temp1 = m.data().timestamp;
        let temp2 = n.data().timestamp;

        /* if else statement that does the actual comparing */
        if (temp1 > temp2) {
            return -1;
        } else if (temp1 < temp2) {
            return 1;
        } else if (temp1 === temp2) {
            return 0;
        } else {
            return 0;
        }
    };
    let num1;
    if(comments && !comments.empty) {
        num1 = comments.docs;

        /* sort */
        num1.sort(chooselarger);
    }
    const navigateImageLeft = () => {
        var indexOfImage = currentImages.indexOf(currentImage);
        if(indexOfImage >= 1){
            setCurrentImage(currentImages[indexOfImage - 1]);
        }
    };

    const navigateImageRight = () => {
        var indexOfImage = currentImages.indexOf(currentImage);
        if(indexOfImage < currentImages.length - 1){
            setCurrentImage(currentImages[indexOfImage + 1]);
        }
    };

    const addLike = () => {
        db.collection("artifacts")
            .doc(currentArtifactID)
            .collection("likes")
            .add({
                name: user.user.displayName,
                timestamp: new Date(),
                email: user.user.email,
            })
    };


    return (
    <div id={"homecontainer"}>

        {(() => {
            if(openUploadForm){
                return(
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={openUploadForm}
                    >
                        <Upload handleOpenUploadForm={setOpenUploadForm}/>
                    </Modal>);
            }
        })()}
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>

            <Grid id={"middlepane"} style={{position: 'relative'}} item xs={12} sm={8}>
                <Grid item xs={12} >
                    <CardMedia
                        id={"middlepaneimage"}
                        component="img"
                        image={currentImage}/>


                </Grid>
                <Grid item xs={12} style={{textAlign: "center", position: 'relative'}}>

                <IconButton
                    onClick={() => addLike()}
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        width: '50px',
                        height: '50px',
                        border:  'solid',
                        borderRadius: '200%',
                        backgroundColor: "#E7E3E1"}}>
                    <FontAwesomeIcon
                        icon="thumbs-up"
                        color={"#F87531"}

                    />
                </IconButton>
                </Grid>
                <Grid container xs={12} style={{textAlign: "left", position: 'relative'}}>
                    <Grid item xs={1}>
                        <IconButton  style={{textAlign: "left", position: 'relative',bottom: '35vh',}} onClick={()=>{
                            navigateImageLeft();
                        }}>
                    <FontAwesomeIcon
                        icon="caret-left"
                        style={{width: '20px'}}
                        color={"white"}
                    />
                        </IconButton>
                    </Grid>
                    <Grid item xs={10}>
                    </Grid>
                    <Grid item xs={1}  style={{textAlign: "right"}}>
                        <IconButton  style={{textAlign: "left", position: 'relative',bottom: '35vh',}}
                                     onClick={()=>{
                                         navigateImageRight();
                                     }}>
                        <FontAwesomeIcon
                            style={{width: '20px'}}
                            icon="caret-right"
                            color={"white"}

                        />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container justify="space-evenly" xs={12} sm={3}>
                <Grid id="rightpanelist" item xs={12} md={12}>
                <Card>
                    <CardHeader
                        style={{textAlign: "center"}}
                        title="Artifacts"
                    />
                </Card>

                    <List style={{width: '100%',
                        maxWidth: 360,
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 200,}}>
                {(() => {
                    if(artifacts){
                        return artifacts.docs.map(document => {
                            return(
                                <ListItem
                                    button
                                    onClick={()=>{
                                        setCurrentImage(document.data().imageUrl[0]);
                                        setCurrentImages(document.data().imageUrl);
                                        setCurrentDocument(document.data());
                                        setCurrentArtifactID(document.id);
                                        setCurrentDocumentRef(document.ref);
                                    }}>
                                        {document.data().Name}
                                </ListItem>);
                        });
                    }
                })()}
                    </List>
                    <div style={{textAlign: 'right'}}>
                        <IconButton
                            onClick={() => addLike()}
                            style={{marginTop: '-70px', position: 'relative'}}
                        >
                            <FontAwesomeIcon
                                icon="plus-circle"
                                color={"#F87531"}
                                onClick={() => handleOpenUploadForm()}
                            />
                        </IconButton>
                    </div>
                </Grid>
                <Grid id={"leftpanelist"} item xs={12} md={12}>
                    <Card>
                        <CardHeader
                            style={{textAlign: "center"}}
                            title="Description"
                        />
                    </Card>
                    <List style={{width: '100%',
                        maxWidth: 360,
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 200,}}>
                        {Object.keys(currentDocument).map(key => {
                            if(key==="imageUrl"){
                                return null;
                            }
                            else {
                                return (

                                    <ListItem>
                                        <ListItemText
                                            primary={key}
                                            secondary={currentDocument[key]}
                                        />
                                    </ListItem>
                                );
                            }
                        })}
                    </List>
                </Grid>
            </Grid>

        </Grid>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid item xs={12} sm={8}>

                    <TextField
                        id="standard-full-width"
                        style={{ margin: 8 }}
                        placeholder="Comment"
                        helperText={button}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={event => handleCommentChange(event)}
                        value={comment}
                    />

            </Grid>
            <Grid item xs={12} sm={3}/>
        </Grid>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid item xs={12} sm={8}>

                <Infinite containerHeight={200} elementHeight={60}>
                    {(() => {
                        if(comments && !comments.empty){
                            return num1.map(document => {
                                return(
                                    <ListItem>
                                        {document.data().user}
                                        {":"}
                                        {document.data().comment}
                                        {", "}
                                        {JSON.stringify(moment(Number(new Date(document.data().timestamp).getTime().toString())).format('MMMM Do YYYY, h:mm:ss a'))}
                                        {/*{comments.docs.toString()}*/}
                                    </ListItem>);
                            });
                        }
                    })()}
                </Infinite>
            </Grid>
            <Grid item xs={12} sm={3}/>
        </Grid>
    </div>
    );
}
export default Home;