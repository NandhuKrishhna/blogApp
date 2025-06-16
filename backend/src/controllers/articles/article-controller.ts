import { OK } from "../../constants/http";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { stringToObjectId } from "../../utils/bcrypt";
import catchErrors from "../../utils/catchErrors";
import { Request, Response } from "express";
import { createArticleSchema } from "../../utils/validation/article-validation";
import { createArticle, deleteArticle, getAllArticles } from "../../services/article-services";

export const getAllArticlesHandler = catchErrors(async (req: Request, res: Response) => {
    const articles = await getAllArticles(req.query);
    return res.status(OK).json({
        success: true,
        message: "Articles fetched successfully",
        ...articles
    })
});


// export const getUserArticlesHandler = catchErrors(async (req: Request, res: Response) => {
//     const { userId } = req as AuthenticatedRequest;
//     const articles = await getUserArticles(userId, req.query);
//     return res.status(OK).json({
//         success: true,
//         message: "Articles fetched successfully",
//         ...articles
//     })
// });


export const createArticleHandler = catchErrors(async (req: Request, res: Response) => {
    const { userId: id } = req as AuthenticatedRequest;
    const article = createArticleSchema.parse(req.body);
    const newArticle = await createArticle(id, article);
    return res.status(OK).json({
        success: true,
        message: "Article created successfully",
        data: newArticle,
    });
});

export const deleteArticleHandler = catchErrors(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const articleId = stringToObjectId(req.params.id);
    await deleteArticle(userId, articleId);
    return res.status(OK).json({
        success: true,
        message: "Article deleted successfully",
    });
});
