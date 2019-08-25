const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3005;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, function(){
    console.log(`Express listening on port ${PORT}`);
});

