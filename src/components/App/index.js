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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SignUp from '../SignUp';
import LogOutButton from '../LogOut';
import {get} from 'lodash';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Invite from '../Invite';
import ArtifactManagement from '../ArtifactManagement';
import IconButton from '@material-ui/core/IconButton';

library.add(faHome, faFileUpload );

const App = (props) => {

    function changeBackground(color) {
        document.body.style.background = 'url(https://media1.giphy.com/media/aRZ4vTsHnyW6A/giphy.gif)';
        document.body.style.fontFamily = `"COMIC SANS", "COMIC RELIEF", PAPYRUS, cursive`;
        document.body.style.color = 'red';
        var x =  document.getElementsByClassName("MuiTypography-root MuiListItemText-secondary MuiTypography-body2 MuiTypography-colorTextSecondary");


// Create a for loop and set the background color of all p elements in div
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.fontFamily = `"COMIC SANS", "COMIC RELIEF", PAPYRUS, cursive`;
            x[i].style.color = 'green';
        }

        var y =  document.getElementsByClassName("MuiTypography-root MuiListItemText-primary MuiTypography-body1");


// Create a for loop and set the background color of all p elements in div
        var j;
        for (j = 0; j < y.length; j++) {
            y[j].style.fontFamily = `"COMIC SANS", "COMIC RELIEF", PAPYRUS, cursive`;
            y[j].style.color = 'blue';
        }

        // element that will be wrapped
        var el = document.querySelector('#passDownArtifact');
        // create wrapper container
        if(el){
                var wrapper = document.createElement('marquee');
                // insert wrapper before el in the DOM tree
                el.parentNode.insertBefore(wrapper, el);
                // move el into wrapper
                wrapper.appendChild(el);
            }

        // element that will be wrapped
        var el2 = document.querySelector('#titleOfApp');
        // create wrapper container
        el2.style.paddingTop = '20px';
        var wrapper2 = document.createElement('marquee');
        // insert wrapper before el in the DOM tree
        el2.parentNode.insertBefore(wrapper2, el2);
        // move el into wrapper
        wrapper2.appendChild(el2);

        // element that will be wrapped
        var el3 = document.querySelectorAll('.MuiButtonBase-root.MuiListItem-root.MuiListItem-gutters.MuiListItem-button');
        for(var k = 0; k < el3.length; k++) {
        // create wrapper container
            var wrapper3 = document.createElement ('marquee');
        // insert wrapper before el in the DOM tree
            el3[k].parentNode.insertBefore (wrapper3, el3[k]);
        // move el into wrapper
            wrapper3.appendChild (el3[k]);
        }

        var el4 =  document.getElementsByClassName("MuiPaper-root MuiPaper-elevation1 MuiCard-root MuiPaper-rounded");

        for(var l = 0; l < el4.length; l++) {
            el4[l].style.background = 'url(https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX26992147.jpg)';
        }


        var el5 =  document.getElementsByClassName("MuiList-root MuiList-padding");

        for(var m = 0; m < el5.length; m++) {
            el5[m].style.backgroundColor = 'yellow';
        }

        var el6 =  document.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-8");

        for(var n = 0; n < el6.length; n++) {
            el6[n].style.backgroundColor = 'yellow';
        }

        var el7 =  document.getElementById("mainappbar");
        el7.style.backgroundImage =   'linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)';
    }

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


    // Set anchor variable for menu item
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


    // Detect user change and store it on a local variable
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    // show different user menu depending on if user is admin/Helen
    const userMenu = () => {
        if(get(user, 'uid', false) === '4KuxRhxmTdesil7mUMe2F0oqQD22'){
            return (
                <>
                    <MenuItem onClick={handleClose}><Link to="/Invite" class={"button"}>Invite User</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link to="/ArtifactManagement" class={"button"}>Pass Down Artifact</Link></MenuItem>
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

                        <IconButton
                          onClick={() => changeBackground('red')}>
                        </IconButton>
                        <Grid item>
                            <Link to="/" class={"button"}>
                                <h1 id={"titleOfApp"} style={{color: 'white'}}>{"Heirloom"}</h1>
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