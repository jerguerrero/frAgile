import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  Upload  from '../Upload';
import Home from '../Home';
import Admin from '../Admin';
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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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

    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    const [user, setUser] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();

    console.log(user);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    const setTab = (index) => {
        setCurrentTab(index);
    }

    const renderTab = () => {
        if(currentTab === 0) {
            return Login();
        }
        else if(currentTab === 1){
            return SignUp();
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

                        <Grid item>
                            <Link to="/Admin">Admin</Link>
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
                        <Tabs
                            value={value}
                            onChange={handleChange}
                        >
                            <Tab label="Login" {...a11yProps(0)} />
                            <Tab label="SignUp" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                        <TabPanel value={value} index={0}>
                            {<Login/>}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {<SignUp/>}
                        </TabPanel>
                    </div>

                </Modal>
                <Route exact path="/" component={Home} />
                <Route exact path="/Upload" component={Upload} />
                <Route exact path="/Login" component={Login} />
                <Route exact path="/Admin" component={Admin} />

                {/*for testing only, should be deleted in the future*/}
                <Route exact path="/SignUp" component={SignUp} />


            </div>
        </Router>
    );
};

export default App;