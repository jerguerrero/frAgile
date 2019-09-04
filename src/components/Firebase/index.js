import React from 'react';
import * as firebase from "firebase";
import config from '../../config.js';

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();