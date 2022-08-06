const bcrypt = require('bcrypt');
const User = require('../models/user.js');

exports.signupUser = (req, res) => {
    console.log("signup request :", req.body);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then((res) => console.log("user save ok", res)) //(() => res0status(201).json({ message: 'User created' }))
                .catch((err) => console.log("user save fail", err)); //(error => res.status(400).json({ error }))

        })
        .catch((err) => console.log("user password hash failed", err)); //(error => res.status(500).json({ error }))
    res.send({ message: "User signed up" }); //si j'enlève cette ligne ça ne marche pas... mais pourquoi???
};

/*exports.loginUser = (req, res) => {

}*/