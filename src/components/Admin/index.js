import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import * as firebase from 'firebase';
import {useAlert} from "react-alert";
import Grid from "@material-ui/core/Grid";
import Invite from '../Invite';
import ArtifactManagement from "../ArtifactManagement";

const Admin = () => {

    return (
        <p>This should have a sidebar for invite and artifact management with the content dynamically rendered</p>
    )
};
export default Admin;