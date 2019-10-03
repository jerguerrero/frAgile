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
import { useCollection} from 'react-firebase-hooks/firestore';
import TextField from '@material-ui/core/TextField';
import './home.css';
import moment from "moment";
import {faCaretLeft, faCaretRight} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
library.add(faCaretLeft, faCaretRight);

const Home = () => {

    const db = firebase.firestore();


    const [currentDocument, setCurrentDocument] = useState({});
    const [currentArtifactID, setCurrentArtifactID] = useState(" ");
    const [currentImage, setCurrentImage] = useState(null);
    const [currentDocumentRef, setCurrentDocumentRef] = useState(null);
    const [comment, setComment] = useState("");
    const [currentImages, setCurrentImages] = useState(null);

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

    const handleCommentChange = (event) =>{
        setComment(event.target.value);
    };

    const submitComment = () =>{
        if(comment){
            currentDocumentRef.collection("comments")
                .add({comment, timestamp: moment(Number(new Date().getTime().toString())).format('MMMM Do YYYY, h:mm:ss a')})
                .then(() => {
                    console.log("Successfuly saved");
                    setComment("");
                })
                .catch( error => {
                    console.log(error);
                });
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

    return (
    <div id={"homecontainer"}>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid id={"leftpanelist"} item xs={2}>
                <Card>
                    <CardHeader
                        style={{textAlign: "center"}}
                        title="Description"
                    />
                </Card>
                <Infinite id="leftpanelist" containerHeight={200} elementHeight={40}>
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
                </Infinite>
            </Grid>
            <Grid id={"middlepane"} item xs={5}>

                    <CardMedia
                        id={"middlepaneimage"}
                        component="img"
                        image={currentImage}/>
                        <FontAwesomeIcon
                            style={{position: "absolute", bottom: '65vh', width: '25px', height: '25px'}}
                            icon="caret-left"
                            color={"white"}
                            onClick={()=>{
                                navigateImageLeft();
                            }}
                        />
                        <FontAwesomeIcon
                            style={{position: "absolute", right: '30.5vw', bottom: '65vh', width: '25px', height: '25px'}}
                            icon="caret-right"
                            color={"white"}
                            onClick={()=>{
                                navigateImageRight();
                            }}
                        />

            </Grid>
            <Grid id="rightpanelist" item xs={2}>
                <Card>
                    <CardHeader
                        style={{textAlign: "center"}}
                        title="Artifacts"
                    />
                </Card>
                <Infinite containerHeight={200} elementHeight={60}>
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
                </Infinite>

            </Grid>
        </Grid>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid item xs={5}>

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
        </Grid>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid item xs={5}>

                <Infinite containerHeight={200} elementHeight={60}>
                    {(() => {
                        if(comments && !comments.empty){
                            return comments.docs.map(document => {
                                return(
                                    <ListItem>
                                        {JSON.stringify(document.data().comment)}
                                        {", "}
                                        {JSON.stringify(document.data().timestamp)}
                                        {/*{comments.docs.toString()}*/}
                                    </ListItem>);
                            });
                        }
                    })()}
                </Infinite>

            </Grid>
        </Grid>
    </div>
    );
}
export default Home;