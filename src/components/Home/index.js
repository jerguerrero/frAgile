import React, {useState} from 'react';
import Infinite from "react-infinite";
import firebase from '../Firebase/index.js';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import Img from 'react-image';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import CardMedia from '@material-ui/core/CardMedia';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import './home.css';

const Home = () => {

    const db = firebase.firestore();


    const [currentDocument, setCurrentDocument] = useState({});
    const [currentArtifactID, setCurrentArtifactID] = useState(" ");
    const [currentImage, setCurrentImage] = useState(null);
    const [currentDocumentRef, setCurrentDocumentRef] = useState(null);
    const [comment, setComment] = useState("");

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
                .add({comment})
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


    return (
    <div id={"homecontainer"}>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={4}>
            <Grid id={"leftpanelist"} item xs={2}>
                <Infinite id="leftpanelist" containerHeight={200} elementHeight={40}>
                    {Object.keys(currentDocument).map(key => {
                        return(
                            <ListItem>
                                <ListItemText
                                    primary={key}
                                    secondary={currentDocument[key]}
                                />
                            </ListItem>
                        );
                    })}
                </Infinite>
            </Grid>
            <Grid id={"middlepane"} item xs={5}>

                    <CardMedia
                        id={"middlepaneimage"}
                        component="img"
                        image={currentImage}/>

            </Grid>
            <Grid id="rightpanelist" item xs={2}>
                <Infinite containerHeight={200} elementHeight={60}>
                {(() => {
                    if(artifacts){
                        return artifacts.docs.map(document => {
                            return(
                                <ListItem
                                    button
                                    onClick={()=>{
                                        setCurrentImage(document.data().imageUrl);
                                        setCurrentDocument(document.data());
                                        setCurrentArtifactID(document.id);
                                        setCurrentDocumentRef(document.ref);
                                    }}>
                                        {JSON.stringify(document.data().Name)}
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
                        placeholder="Commenting as (Name of User)"
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