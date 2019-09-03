import React, {useState} from 'react';
import config from '../../config.js';
import firebase from '../Firebase/index.js';


const Upload = (props) => {

    const db = firebase.firestore();
    // db.collection("artifacts").doc("sample").set({
    //     title: "sample",
    // })
    //     .then(() => {
    //         console.log("Successfuly saved");
    //     })
    //     .catch( error => {
    //         console.log(error);
    //     });
    const [fields, setFields] = useState([{value: null}]);

    const addInputField = () => {
        const values = [...fields];
        values.push({value: null});
        setFields(values);
    };

    function handleChange(i, event) {
        const values = [...fields];
        values[i].value = event.target.value;
        setFields(values);
    }
    return (
        <div>
        <form>
            {/*Initial Fields*/}
            <label>
                <input type="file"/>
            </label>
            <br/>
            <label>
                {"Name"}
                <input type="text"/>
            </label>
            {/*TODO: Replace <br> with css flex box*/}
            <br/>
            <label>
                {"Tags"}
                <input type="text"/>
            </label>
            <br/>

            {/*Adding new fields dynamically*/}
            <button type="button" onClick={() => addInputField()}>
                +
            </button>
            {fields.map((field, idx) => {
                return (
                    <div key={`${field}-${idx}`}>
                        <textarea  placeholder={"Label"}></textarea>
                        <input
                            type="text"
                            placeholder="Enter text"
                            onChange={e => handleChange(idx, e)}
                        />
                    </div>
                );
            })}
            <input type="submit" value="Submit" />
        </form>
        </div>
    )
};
export default Upload;