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
    <div>
        <Grid container
              direction="row"
              justify="space-around"
              alignItems="baseline"
              spacing={4}>
            <Grid item xs={2}>
                <Infinite containerHeight={200} elementHeight={40}>
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
            <Grid item xs={2}>
                <Card>
                    <CardMedia
                        component="img"
                        image={currentImage}/>
                </Card>
            </Grid>
            <Grid item xs={5}>
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