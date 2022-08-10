const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/userR.js');//will be rename userRoutes
const sauceRoutes = require('./routes/saucesR.js');
const path = require('path');

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

//routes
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));




module.exports = app;