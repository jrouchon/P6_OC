const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

exports.signupUser = (req, res) => {
    //console.log("signup request :", req.body);
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
    res.status(201).json({ message: 'User signed up' }); //si j'enlève cette ligne ça ne marche pas... mais pourquoi???
};

exports.loginUser = (req, res) => { //pb si user signup need async await
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'login ou mot de passe invalide' })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'login ou mot de passe invalide' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign( //need to change random token before prod
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h'}
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }));
}