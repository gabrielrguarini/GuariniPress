const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new");
});

router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/categories/index", { categories: categories });
    });
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id)
        .then((category) => {
            if (category) {
                res.render("admin/categories/edit", { category });
            } else {
                res.redirect("/admin/categories/");
            }
        })
        .catch((err) => {
            res.send(err);
        });
});

router.post("/categories/save", adminAuth, (req, res) => {
    const title = req.body.title;

    if (title) {
        Category.create({
            title: title,
            slug: slugify(title).toLowerCase(),
        })
            .then(() => {
                res.redirect("/admin/categories/");
            })
            .catch((err) => {
                res.send(err);
            });
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.post("/categories/delete", adminAuth, (req, res) => {
    const id = req.body.id;
    if (id) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id,
                },
            }).then(() => {
                res.redirect("/admin/categories");
            });
        } else {
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
});

router.post("/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update(
        {
            title: title,
            slug: slugify(title).toLowerCase(),
        },
        { where: { id } }
    )
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch((err) => {
            res.send(err);
        });
});
module.exports = router;
