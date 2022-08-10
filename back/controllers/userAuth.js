const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

exports.signupUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created' }))
                .catch(error => res.status(400).json({ error }))

        })
        .catch(error => res.status(500).json({ error }));
};

exports.loginUser = (req, res) => { 
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
                                    'RANDOM_TOKEN',
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