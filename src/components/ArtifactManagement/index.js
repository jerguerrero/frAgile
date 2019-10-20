import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import * as firebase from 'firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import 'react-table/react-table.css'
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Infinite from "react-infinite";
import ListItem from "@material-ui/core/ListItem";
import './artifact.css';
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";


const ArtifactManagement = () => {

    const db = firebase.firestore();

    const [currentDocument, setCurrentDocument] = useState({});
    const [currentArtifactID, setCurrentArtifactID] = useState(" ");
    const [currentImage, setCurrentImage] = useState(null);
    const [currentDocumentRef, setCurrentDocumentRef] = useState(null);
    const [currentImages, setCurrentImages] = useState(null);


    const [artifacts, artifactsLoading, artifactsError] = useCollection(
        db.collection('artifacts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [likes, likesLoading, likesError] = useCollection(
        db.collection('artifacts')
            .doc(currentArtifactID)
            .collection("likes"),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    // Change owner registered for the artifact on the databse
    const passDownArtifact = () =>{
        console.log("OWNER CHANGED")
    };

    let num1;
    if(likes && !likes.empty) {
        num1 = likes.docs;
        num1.map(document => {
            console.log(document.data());
        });
    }

    return (

        <div id={"homecontainer"}>
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
                                    // Change this into artifacts that has subcollection 'likes' only
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
                <Grid item xs={12} sm={3}/>
            </Grid>
            <Grid container
                  direction="row"
                  justify="space-evenly"
                  alignItems="flex-start"
                  spacing={4}>
                <Grid item xs={12} sm={8}>
                    <Card>
                        <CardHeader
                            style={{textAlign: "center"}}
                            title="Inheritance Candidate"
                        />
                    </Card>
                    <Infinite containerHeight={200} elementHeight={60}>
                        {(() => {
                            if(likes && !likes.empty){
                                return num1.map(document => {
                                    return(
                                        <ListItem>
                                            {document.data().name}
                                            {":"}
                                            {document.data().reason}
                                            <button
                                                onClick={passDownArtifact}>
                                                {"Pass Down"}
                                            </button>
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
};
export default ArtifactManagement;