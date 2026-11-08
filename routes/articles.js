const router = require('express').Router();


const {
    getArticle,
    saveArticle,
    deleteArticle,
} = require('../controllers/articles');

router.get("/", getArticle);
router.post("/", saveArticle);
router.delete("/:_id", deleteArticle);

module.exports = router;