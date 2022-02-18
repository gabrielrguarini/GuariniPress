const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
    }).then((articles) => {
        res.render("admin/articles/index", { articles });
    });
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/articles/new", { categories });
    });
});

router.post("/articles/update", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var id = req.body.id;
    var category = req.body.category;
    Article.update(
        {
            title: title,
            body: body,
            categoryId: category,
            slug: slugify(title).toLowerCase(),
        },
        { where: { id: id } }
    )
        .then(() => {
            res.redirect("/admin/articles");
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title,
        slug: slugify(title).toLowerCase(),
        body,
        categoryId: category,
    })
        .then(() => {
            res.redirect("/admin/articles");
        })
        .catch((err) => {
            res.send(err);
        });
});

router.post("/articles/delete", (req, res) => {
    const id = req.body.id;
    if (id) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id,
                },
            }).then(() => {
                res.redirect("/admin/articles");
            });
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;
    Article.findByPk(id).then((article) => {
        Category.findAll().then((categories) => {
            res.render("admin/articles/edit", { article, categories });
        });
    });
});

module.exports = router;
