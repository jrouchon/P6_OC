const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


//mongodb connect
const dbuser = process.env.DB_USER
const dbpasswd = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://${dbuser}:${dbpasswd}@cluster0.v0vdoa1.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//db user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema);
/*
const user = new User({ name: "test2", password: "password2" });
user.save()
    .then((res) => console.log("user save ok", res))
    .catch((err) => console.loog("user save fail", err))
 */

//middleware cors bodyparser
app.use(cors())
app.use(express.json());

app.post("/api/auth/signup", (req, res) => {
    console.log("signup request :", req.body);
    const email = req.body.email;
    const password = req.body.password;

    console.log("email :", email);
    console.log("password :", password);

    const user = new User({ email: email, password: password });
    user.save()
        .then((res) => console.log("user save ok", res))
        .catch((err) => console.loog("user save fail", err))

    res.send({message : "test requete post"})
})

app.get("/", (req, res) => res.send("hello test"));

//routes
/*
app.post("/api/auth/signup"), (req, res, next) => {

    console.log("signup request :", req.body);
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({ name: email, password: password });
    user.save()
        .then((res) => console.log("user save ok", res))
        .catch((err) => console.loog("user save fail", err))
    
    res.send({ message: "test route reponse" })
    //next()
}*/



module.exports = app;