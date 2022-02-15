const PORT = 8080;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");

app.set("view engine", "ejs");

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
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log("Servidor Rodando!");
});
