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
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../Firebase';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// for testing only, should be deleted in the future
import SignUp from '../SignUp';
import LogOutButton from '../LogOut';

library.add(faHome, faFileUpload );

const App = (props) => {

    const useStyles = makeStyles(theme => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const [user, setUser] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();


    const renderTab = () => {
        if(currentTab === 0) {
            return <Login/>;
        }
        else if(currentTab === 1){
            return <SignUp/>;
        }
        else{
            return null;
        }
    };

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    console.log(user);
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

                        {/*for testing only, should be deleted in the future*/}
                        <Grid item>
                            <Link to="/SignUp">SignUp</Link>
                        </Grid>
                        {/*for testing only, should be deleted in the future*/}
                        <Grid item>
                            <LogOutButton/>
                        </Grid>

                    </Grid>
                </AppBar>
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    className={classes.modal}
                    open={!user}
                >
                    <div>
                    <AppBar position="static">
                        <Tabs>
                            <Tab label="Login" onClick={() => setCurrentTab(0)}/>
                            <Tab label="SignUp" onClick={() => setCurrentTab(1)}/>
                        </Tabs>
                    </AppBar>
                        {renderTab()}
                    </div>

                </Modal>
                <Route exact path="/" component={Home} />
                <Route exact path="/Upload" component={Upload} />
                <Route exact path="/Login" component={Login} />

                {/*for testing only, should be deleted in the future*/}
                <Route exact path="/SignUp" component={SignUp} />


            </div>
        </Router>
    );
};

export default App;