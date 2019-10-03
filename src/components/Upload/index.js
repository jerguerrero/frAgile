import React, {useState} from 'react';
import firebase from '../Firebase/index.js';
import FileUploader from "react-firebase-file-uploader";
import Grid from '@material-ui/core/Grid';
import { useAlert } from 'react-alert'
import Infinite from "react-infinite";
import './upload.css';


const Upload = (props) => {

    const db = firebase.firestore();
    const storage = firebase.storage().ref('image');
    const alert = useAlert();

    // State for for form values
    const [formValues, setFormValues] = useState({});
    // State for extra input fields
    const [fields, setFields] = useState(["Name", "Tags"]);
    const [label, setLabel] = useState(null);
    const [images, setImages] = useState(null);
    const [uploader, setUploader] = useState(null);
    const [fileUploaded, setFileUploaded] = useState([]);

    const addInputField = (label) => {
        const values = [...fields];
        if(values.includes(label)){
            alert.show('Label already exists');
        }
        else{
            values.push(label);
            setFields(values);
        }
    };

    const handleInputChange = (label, event) => {
        //Adds new value
        setFormValues({...formValues, [label]: event.target.value});
    };

    const handleLabelChange = (event) => {
        setLabel(event.target.value);
    };

    const handleChangeImage = (event) => {
        console.log(event.target.files);
        const images = Array.from(event.target.files);
        setImages(images);
        // images.forEach(image => {
        //     console.log(image);
        // });
    };

    const createArtifactWithImage = (imageUrl) => {
        var artifact = formValues;
        artifact["imageUrl"] = imageUrl;
        console.log(artifact);
        db.collection("artifacts")
            .add(artifact)
            .then(() => {
                console.log("Successfuly saved");
                alert.show('Artifact Successfully Saved!')
            })
            .catch( error => {
                console.log(error);
            });
    };

    const getDownloadURL =  async filename => {
        const imageUrl = await storage.child(filename).getDownloadURL()
            .catch(error => {
                console.log(error);
            });
        return imageUrl;
    }

    const handleUploadSuccess = async (filenames, task) => {

        const downloadURLs = filenames.map(filename => getDownloadURL(filename));
        console.log(downloadURLs);

        Promise.all(downloadURLs).then(function(downloadURLs) {
            createArtifactWithImage(downloadURLs);
            document.getElementById("photoUploadForm").reset();
            setFormValues({});
            setFields(["Name", "Tags"]);
            // setImage(null);
            setLabel(null);
            setFileUploaded([]);
            setImages(null);
        });


    };

    const handleSubmit = (event) => {
        event.preventDefault ();
        if (uploader && images) {
            images.forEach(image => uploader.startUpload(image));
        }
    };

    return (
        <div>
            <Grid container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                  spacing={4}>
                <Grid item xs={2}>
                    <Infinite containerHeight={200} elementHeight={40}>
                    </Infinite>
                </Grid>
                <Grid item xs={2}>
                    <form id={"photoUploadForm"} onSubmit={event => handleSubmit(event)}>
                        {/*Initial Fields*/}
                            <FileUploader
                                id={'fileupload'}
                                ref={uploader => {setUploader(uploader)}}
                                accept="image/*"
                                randomizeFilename
                                storageRef={storage}
                                onChange={handleChangeImage}
                                onUploadSuccess={(filename, task) => {
                                    var totalFileUploaded = fileUploaded;
                                    totalFileUploaded.push(filename);
                                    setFileUploaded(fileUploaded);

                                    if(images.length === totalFileUploaded.length){
                                        return handleUploadSuccess(totalFileUploaded, task)
                                    }

                                }}
                                onUploadError={error => {console.log(error)}}
                                multiple
                            />
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        {fields.map((label, index) => {
                            return (
                                <div key={`${label}-${index}`}>
                                    <label>
                                        {label}
                                        <input
                                            type="text"
                                            placeholder="Enter text"
                                            onChange={event => handleInputChange(label, event)}
                                        />
                                    </label>
                                </div>
                            );
                        })}
                        {/*Adding new fields dynamically*/}
                        <br/>
                        <br/>
                        <div>
                        <label>
                            <input
                                id={"addfieldinput"}
                                type="text"
                                placeholder="Enter Label"
                                onChange={event => handleLabelChange(event)}
                                value={label}
                            />
                            <button
                                id={"addfieldbutton"}
                                type="button"
                                onClick={() => addInputField(label)}>
                                {"Add Input"}
                            </button>
                            <br/>
                        </label>
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>

        </div>
    )
};
export default Upload;