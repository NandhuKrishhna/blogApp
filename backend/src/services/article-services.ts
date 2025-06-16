import mongoose from "mongoose";
import ArticleModel from "../models/article.model";
import cloudinary from "../config/cloudinary";
import { BAD_REQUEST } from "../constants/http";
import appAssert from "../utils/appAssert";

export type ArticleQueryParams = {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "title" | "name" | "email";
    order?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
    search?: string;
};

export type CreateArticleParams = {
    title: string
    description?: string
    content: string
    imageUrl?: string
}


export const getAllArticles = async (query: ArticleQueryParams) => {
    const {
        page = 1,
        limit = 10,
        sortBy,
        order,
        startDate,
        endDate,
        search,
    } = query;

    const filters: any = {};
    if (search) {
        filters.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    const defaultSortField = "createdAt";
    const defaultSortOrder = -1;

    const sortField =
        sortBy === "name" || sortBy === "email"
            ? `author.${sortBy}`
            : sortBy || defaultSortField;
    const sortDirection = order === "asc" ? 1 : -1;
    const sortQuery: any = { [sortField]: sortDirection || defaultSortOrder };
    const skip = (page - 1) * limit;
    const articles = await ArticleModel.find(filters)
        .populate({
            path: "author",
            select: "name email",
        })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    const total = await ArticleModel.countDocuments(filters);

    return {
        total,
        page,
        limit,
        articles,
    };
};


export const createArticle = async (
    id: mongoose.Types.ObjectId,
    article: CreateArticleParams
) => {
    let uploadedImageUrl: string | undefined = undefined;

    if (article.imageUrl) {
        const uploadResponse = await cloudinary.uploader.upload(article.imageUrl);
        uploadedImageUrl = uploadResponse.secure_url;
    }
    const newArticleData = {
        ...article,
        author: id,
        imageUrl: uploadedImageUrl,
    };
    const newArticle = await ArticleModel.create(newArticleData);
    appAssert(newArticle, BAD_REQUEST, "Article not created. Please try again later");

    return newArticle;
};

export const deleteArticle = async (userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId) => {
    const article = await ArticleModel.findById(articleId);
    appAssert(article, BAD_REQUEST, "Article not found");

    appAssert(
        article.author.equals(userId),
        BAD_REQUEST,
        "You are not authorized to delete this article"
    );
    await article.deleteOne();
};