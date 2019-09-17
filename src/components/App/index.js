import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  Upload  from '../Upload';
import Home from '../Home';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import './app.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Login from '../Login';

library.add(faHome, faFileUpload )

const App = (props) => {


    return (

        <Router>
            <div >
                <AppBar id={"mainappbar"} position="static" >
                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                          spacing={2}>
                        <Grid item>
                            <Link to="/" class={"button"}>
                                <FontAwesomeIcon
                                    icon="home"
                                    size="xl"
                                    color={"white"}
                                />
                                <text>
                                    {" Home"}
                                </text>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/Upload" class={"button"}>
                                <FontAwesomeIcon
                                    icon="file-upload"
                                    size="xl"
                                    color={"white"}
                                />
                                <text>
                                    {" Upload"}
                                </text>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/Login">Login</Link>
                        </Grid>

                    </Grid>
                </AppBar>
                <Route exact path="/" component={Home} />
                <Route exact path="/Upload" component={Upload} />
                <Route exact path="/Login" component={Login} />
            </div>
        </Router>
    );
};

export default App;