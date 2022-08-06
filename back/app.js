const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const apiRoutes = require('./routes/api.js'); //will be rename userRoutes 

//mongodb connect
const dbuser = process.env.DB_USER
const dbpasswd = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://${dbuser}:${dbpasswd}@cluster0.v0vdoa1.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB reussie !'))
    .catch(() => console.log('Connexion a MongoDB echouee !'));


//middleware cors_handling bodyparser
app.use(cors())
app.use(express.json());

//change to a function and need to go in controler/user
app.use('/api/auth', apiRoutes); ////will be rename userRoutes





module.exports = app;