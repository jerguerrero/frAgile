import React, {useState} from 'react';
const Upload = (props) => {
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