import React, {useState} from 'react';
import Infinite from "react-infinite";
import firebase from '../Firebase/index.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import Img from 'react-image';
import '../../stylesheet.css'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const Home = () => {

    const useStyles = makeStyles(theme => ({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: "white",
        },
    }));

    const classes = useStyles();

    const db = firebase.firestore();

    const [currentImage, setCurrentImage] = useState(null);

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
    <h1>Artifacts</h1>
        <Grid container direction="row"
              justify="space-between"
              alignItems="center"
        spacing={10}>

            {/*<div >*/}
           

            <Grid item xs={3} alignItems="center">
                <Img  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} src={currentImage}/>
            </Grid>

            <Grid item justify="flex-end" xs={3}>
                <List className={classes.root}>
                {/*<Infinite*/}
                    {/*containerHeight={200}*/}
                    {/*elementHeight={40}>*/}
                {(() => {
                    if(value){
                        return value.docs.map(document => {
                            console.log(document);
                            return(

                                <ListItem button
                                onClick={()=>{setCurrentImage(document.data().imageUrl)}}>
                                    <ListItemText primary={JSON.stringify(document.data().Name)} />

                            </ListItem>);
                        });
                    }
                })()}
                {/*</Infinite>*/}
                </List>
            </Grid>


            {/*</div>*/}
        </Grid>
</div>
    );
}
export default Home;