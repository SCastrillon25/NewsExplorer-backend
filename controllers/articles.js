const Article = require('../models/article');


const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError')

const getArticle = async (req, res, next) => {
    try {
        const data = await Article.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });
        
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }    
};

const saveArticle = async (req, res, next) => {
    try {
        const {
            keyword,
            title,
            description,
            published_at,
            source,
            image,
            url,

        } = req.body;

        const newArticle = await Article.create({
            keyword,
            title,
            description,
            published_at,
            source,
            image,
            url,
            owner: req.user._id,
        });

        return res.status(201).send({
            keyword: newArticle.keyword,
            title: newArticle.title,
            description: newArticle.description,
            published_at: newArticle.published_at,
            source: newArticle.source,
            image: newArticle.image,
            url: newArticle.url,
        });

    } catch (error) {
      if (error.code === 11000) {
        return next(new ConflictError("Esta noticia ya está guardada"));      
        }
        return next(error);
      }  
};

const deleteArticle = async (req, res, next) => {
    try {
        const articleId = req.params._id;
        const userId = req.user._id;

        const article = await Article.findById(articleId);
        if (!article) {
            throw new NotFoundError('Articulo no encontrado');
        }

        if (article.owner.toString() !== userId.toString()) {
            throw new ForbiddenError(
                'No tienes permiso para eliminar este artículo'
            );
        }

        await Article.findByIdAndDelete(articleId);
        return res.status(200).json({
            message: "Articulo eliminado correctamente",
        });
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getArticle,
    saveArticle,
    deleteArticle,
};
