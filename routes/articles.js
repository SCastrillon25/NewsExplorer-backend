const router = require('express').Router();


const {
    getArticle,
    saveArticle,
    deleteArticle,
} = require('../controllers/articles');
const auth = require('../middleware/auth');

router.get("/", auth, getArticle);
router.post("/", auth, saveArticle);
router.delete("/:_id", auth, deleteArticle);

module.exports = router;