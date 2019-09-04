import React, {useState} from 'react';
import firebase from '../Firebase/index.js';
import FileUploader from "react-firebase-file-uploader";

const Upload = (props) => {

    const db = firebase.firestore();
    const storage = firebase.storage().ref('image');


    // State for for form values
    const [formValues, setFormValues] = useState({});
    // State for extra input fields
    const [fields, setFields] = useState([]);
    const [label, setLabel] = useState(null);
    const [image, setImage] = useState(null);
    const [uploader, setUploader] = useState(null);

    const addInputField = (label) => {
        const values = [...fields];
        values.push(label);
        setFields(values);
    };

    const handleInputChange = (label, event) => {
        //Adds new value
        setFormValues({...formValues, [label]: event.target.value});
    };

    const handleLabelChange = (event) => {
        setLabel(event.target.value);
    };

    const handleChangeImage = (event) => {
        const image = event.target.files[0];
        if (image) {
            setImage(image);
        }
    };

    const createArtifactWithImage = (imageUrl) => {
        var artifact = formValues;
        artifact["imageUrl"] = imageUrl;
        console.log(artifact);
        db.collection("artifacts")
            .add(artifact)
            .then(() => {
                console.log("Successfuly saved");
            })
            .catch( error => {
                console.log(error);
            });
    };

    const handleUploadSuccess = (filename, task) => {
        console.log(filename);
        console.log(task);
        storage.child(filename).getDownloadURL()
            .then(imageUrl =>{
                createArtifactWithImage(imageUrl);
             })
            .catch(error => {
                console.log(error);
            });

    };

    const handleSubmit = (event) => {
        event.preventDefault ();
        console.log(uploader);
        console.log(image);
        if (uploader && image) {
            uploader.startUpload(image);
        }
    };

    return (
        <div>
        <form onSubmit={event => handleSubmit(event)}>
            {/*Initial Fields*/}
            <label>
                Image
                <FileUploader
                    ref={uploader => {setUploader(uploader)}}
                    accept="image/*"
                    randomizeFilename
                    storageRef={storage}
                    onChange={handleChangeImage}
                    onUploadSuccess={(filename, task) =>
                        handleUploadSuccess(filename, task)}
                    onUploadError={error => {console.log(error)}}
                />
            </label>
            <br/>
            <label >
                {"Name"}
                <input
                    type="text"
                    onChange={event => handleInputChange("Name", event)}
                />
            </label>
            <br/>
            <label>
                {"Tags"}
                <input
                    type="text"
                    onChange={event => handleInputChange("Tags", event)}
                />
            </label>
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
            <label>
                {"Add Information"}
                <br/>
            <textarea
                placeholder={"Enter Label"}
                value={label}
                onChange={event => {handleLabelChange(event)}}/>
            <button
                type="button"
                onClick={() => addInputField(label)}>
                +
            </button>
            </label>

            <input type="submit" value="Submit" />
        </form>
        </div>
    )
};
export default Upload;