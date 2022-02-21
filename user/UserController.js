const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/users/index", { users });
    });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", adminAuth, (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email } }).then((user) => {
        if (user) {
            res.send("Esse email já foi cadastrado");
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash,
            })
                .then((user) => {
                    res.redirect("/admin/users/");
                })
                .catch((err) => {
                    res.send(err);
                });
        }
    });
});

router.post("/users/delete", adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        if (!isNaN(id)) {
            User.destroy({ where: { id } })
                .then((user) => {
                    res.redirect("/admin/users");
                })
                .catch((err) => {
                    res.send(err);
                });
        } else {
            res.send("ID não é um número");
        }
    } else {
        res.send("ID não existe");
    }
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email } }).then((user) => {
        if (user) {
            var correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email,
                };
                res.redirect("/admin/categories");
            } else {
                res.send("Senha incorreta");
            }
        } else {
            res.redirect("/login");
        }
    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});
module.exports = router;
