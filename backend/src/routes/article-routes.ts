import { Router } from 'express';
import { createArticleHandler, deleteArticleHandler, getAllArticlesHandler } from '../controllers/articles/article-controller';

const articleRoutes = Router();
articleRoutes.get('/get-articles', getAllArticlesHandler);
articleRoutes.post("/create-article", createArticleHandler)
articleRoutes.delete("/delete-article/:id", deleteArticleHandler);


export default articleRoutes;