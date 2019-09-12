import React, {useState} from 'react';
import Infinite from "react-infinite";
import firebase from '../Firebase/index.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import Img from 'react-image';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import CardMedia from '@material-ui/core/CardMedia';
import ListItemText from '@material-ui/core/ListItemText';
import './home.css';

const Home = () => {

    const db = firebase.firestore();

    const [currentImage, setCurrentImage] = useState(null);
    const [currentDocument, setCurrentDocument] = useState({});

    const [value, loading, error] = useCollection(
        db.collection('artifacts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    if(value){
        console.log(value.docs);
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
                    if(value){
                        return value.docs.map(document => {
                            console.log(document);
                            return(
                                <ListItem
                                    button
                                    onClick={()=>{
                                        setCurrentImage(document.data().imageUrl);
                                        setCurrentDocument(document.data());
                                    }}>
                                        {JSON.stringify(document.data().Name)}
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