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
import SignUp from '../SignUp';
import LogOutButton from '../LogOut';
import {get} from 'lodash';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// for testing only, should be deleted in the future
import Invite from '../Invite';
import ArtifactManagement from '../ArtifactManagement';

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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    const [user, setUser] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();


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

    const userMenu = () => {
        if(get(user, 'uid', false) === '4KuxRhxmTdesil7mUMe2F0oqQD22'){
            return (
                <>
                    <MenuItem onClick={handleClose}><Link to="/Invite">Invite User</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link to="/ArtifactManagement">Pass Down Artifact</Link></MenuItem>
                    <MenuItem onClick={handleClose}><LogOutButton/></MenuItem>
                </>
            );
        }
        else{
            return (
                <>
                    <MenuItem onClick={handleClose}><LogOutButton/></MenuItem>
                </>
            );
        }

    }

    return (

        <Router>
            <div >
                <AppBar id={"mainappbar"} position="static" >
                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                          spacing={2}>
                        {/*<Grid item>*/}
                            {/*<Link to="/" class={"button"}>*/}
                                {/*<FontAwesomeIcon*/}
                                    {/*icon="home"*/}
                                    {/*size="xl"*/}
                                    {/*color={"white"}*/}
                                {/*/>*/}
                                {/*<text>*/}
                                    {/*{" Home"}*/}
                                {/*</text>*/}
                            {/*</Link>*/}
                        {/*</Grid>*/}
                        {/*<Grid item>*/}
                            {/*<Link to="/Upload" class={"button"}>*/}
                                {/*<FontAwesomeIcon*/}
                                    {/*icon="file-upload"*/}
                                    {/*size="xl"*/}
                                    {/*color={"white"}*/}
                                {/*/>*/}
                                {/*<text>*/}
                                    {/*{" Upload"}*/}
                                {/*</text>*/}
                            {/*</Link>*/}
                        {/*</Grid>*/}

                        <Grid item>
                            <Link to="/" class={"button"}>
                                <h1 style={{color: 'white'}}>{"Heirloom"}</h1>
                            </Link>
                        </Grid>

                        <Grid item style={{position: 'absolute', right: '30px'}}>
                            <Button aria-controls="admin-bar" aria-haspopup="true" onClick={handleClick}>
                                <h4 style={{color: 'white'}}>{"Hi "}{get(user, 'displayName', "user")}</h4>
                            </Button>
                            <Menu
                                id="admin-bar"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >

                                {userMenu()}
                            </Menu>
                        </Grid>

                    </Grid>
                </AppBar>
                <Modal
                    id={"authModal"}
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    className={classes.modal}
                    open={!user}

                >
                    <div>
                        <Grid container id={"welcome"}>
                            <Grid item><h1>Welcome to Heirloom</h1></Grid>
                        </Grid>
                    <AppBar id={"modalAppBar"} position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                        >
                            <Tab label="Login" {...a11yProps(0)} />
                            <Tab label="Sign Up" {...a11yProps(1)} />
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
                <Route exact path="/"
                       render={(props) => <Home {...props} user={user} />}
                />
                <Route exact path="/Upload" component={Upload} />
                <Route exact path="/Login" component={Login} />
                <Route exact path="/Admin" component={Admin} />
                <Route exact path="/SignUp" component={SignUp} />

                {/*for testing only, should be deleted in the future*/}
                <Route exact path="/Invite" component={Invite} />
                <Route exact path="/ArtifactManagement"
                       // component={ArtifactManagement} />
                       render={(props) => <ArtifactManagement {...props} user={user} />}
                       />


            </div>
        </Router>
    );
};

export default App;