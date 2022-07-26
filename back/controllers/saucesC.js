const Sauce = require('../models/sauce.js');
const fs = require('fs');

exports.getSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

//recuperation des info sur la sauce dans la req, ajout de l'id utilisateur de l'auth, enregistrement de la sauce en bdd
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce !' }))
        .catch(error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
}

//parse la req si c'est au format fichier, sinon on passe le body,
//trouve la sauce et on verif l'id utilisateur, supprime l'ancienne image et on update l'objet avec les nouvelles info
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({
                    error: new Error(" unauthorized request ")
                });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                console.log({ filename });
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { ...sauceObject, _id: req.params.id }
                    )
                        .then(() => res.status(200).json({ message: "Sauce mise a jour !" }))
                        .catch((error) => res.status(400).json({ error }));
                })
            }
        })
}

//trouve la sauce a supprimer, verif l'id utilisateur, supprime l'image du fichier images et on supprime la sauce en bdd
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({
                    error: new Error("  unauthorized request ")
                });
            }

            if (!sauce) {
                res.status(404).json({ error });
            }

            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimee !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        });
};

//trouve si la sauce a deja un like ou un dislike de cet utilisateur, si on doit ajouter un like on verif que la sauce n'est pas d�j� lik�,
//si la sauce est d�j� dislik� on enleve le dislike et on ajoute un like, sinon on ajoute un like 
//meme fonctionnement pour le dislike, on update la sauce
exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({
                    error: new Error("Cette sauce n'existe pas"),
                });
            };

            const userLikeIndex = sauce.usersLiked.findIndex(
                (userId) => userId == req.body.userId
            );
            const userDislikeIndex = sauce.usersDisliked.findIndex(
                (userId) => userId == req.body.userId
            );
            if (req.body.like === 1) {
                if (userLikeIndex !== -1) {
                    return res.status(500).json({
                        error: new Error("vous aimez cette sauce"),
                    });
                }
                if (userDislikeIndex !== -1) {
                    sauce.usersDisliked.splice(userDislikeIndex, 1);
                    sauce.dislikes--;
                }
                sauce.usersLiked.push(req.body.userId);
                sauce.likes++;
            }
            if (req.body.like === -1) {
                if (userDislikeIndex !== -1) {
                    return res.status(500).json({
                        error: new Error("vous n'aimez pas cette sauce"),
                    });
                }
                if (userLikeIndex !== -1) {
                    sauce.usersLiked.splice(userLikeIndex, 1);
                    sauce.likes--;
                }
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes++;
            }
            if (req.body.like === 0) {
                if (userDislikeIndex !== -1) {
                    sauce.usersDisliked.splice(userDislikeIndex, 1);
                    sauce.dislikes--;
                }
                else if (userLikeIndex !== -1) {
                    sauce.usersLiked.splice(userLikeIndex, 1);
                    sauce.likes--;
                }
            }
            Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
                res.status(200).json({ message: "Avis enregistre !" });
            });
        });
};
