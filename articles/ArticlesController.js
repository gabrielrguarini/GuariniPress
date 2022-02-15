const express = require("express");
const router = express.Router();

router.get("/articles", (req, res) => {
    res.send("Rota de categorias");
});
router.get("/admin/articles/new", (req, res) => {
    res.send("Criar artigos");
});
module.exports = router;
