import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  Upload  from '../Upload';
import Home from '../Home';
const App = (props) => {

    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/Upload">Upload</Link>
                    </li>
                </ul>
                <hr />

                <Route exact path="/" component={Home} />
                <Route exact path="/Upload" component={Upload} />
            </div>
        </Router>



);
}

export default App;