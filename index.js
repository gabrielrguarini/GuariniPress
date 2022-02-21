const PORT = 8080;
const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

app.set("view engine", "ejs");

app.use(
    session({
        secret: "umAcOisa",
        cookie: { maxAge: 3600 * 1000 },
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso");
    })
    .catch((err) => {
        console.log("falha na conexão " + err);
    });

app.use(express.static("public"));

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({ order: [["id", "DESC"]], limit: 4 }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render("index", { articles, categories });
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug,
        },
    })
        .then((article) => {
            if (article) {
                Category.findAll().then((categories) => {
                    res.render("article", { article, categories });
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({ where: { slug }, include: [{ model: Article }] })
        .then((category) => {
            if (category) {
                Category.findAll().then((categories) => {
                    res.render("index", {
                        articles: category.articles,
                        categories,
                    });
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.send(err);
        });
});

app.listen(PORT, () => {
    console.log("Servidor Rodando!");
});
