import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '../utils/article.enum';




export interface IArticleDocument extends Document {
    title: string;
    description?: string;
    content: string;
    author: mongoose.Types.ObjectId;
    imageUrl?: string;

}

const ArticleSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

ArticleSchema.index({ title: 'text', content: 'text' });

const ArticleModel = mongoose.model<IArticleDocument>('Article', ArticleSchema);

export default ArticleModel;
