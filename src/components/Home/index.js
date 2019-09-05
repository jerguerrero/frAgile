import React, {useState} from 'react';
import Infinite from "react-infinite";
import firebase from '../Firebase/index.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import Img from 'react-image';
import '../../stylesheet.css'

const Home = () => {

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
        <Infinite containerHeight={200} elementHeight={40}>
        {(() => {
            if(value){
                return value.docs.map(document => {
                    console.log(document);
                    return(<li
                        onClick={()=>{setCurrentImage(document.data().imageUrl)}}>
                        {JSON.stringify(document.data().Name)}
                    </li>);
                });
            }
        })()}
        </Infinite>
        <Img src={currentImage}/>
        <h1>HomePage</h1>
    </div>
    );
}
export default Home;