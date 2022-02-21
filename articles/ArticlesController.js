const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
    }).then((articles) => {
        res.render("admin/articles/index", { articles });
    });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/articles/new", { categories });
    });
});

router.post("/articles/update", adminAuth, (req, res) => {
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

router.post("/articles/save", adminAuth, (req, res) => {
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

router.post("/articles/delete", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    const id = req.params.id;
    Article.findByPk(id).then((article) => {
        Category.findAll().then((categories) => {
            res.render("admin/articles/edit", { article, categories });
        });
    });
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    if (page == 0) {
        page = 1;
    }

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset,
        order: [["id", "DESC"]],
    }).then((articles) => {
        var next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next,
            articles,
        };
        Category.findAll().then((categories) => {
            res.render("admin/articles/page", { result, categories });
        });
    });
});

module.exports = router;
