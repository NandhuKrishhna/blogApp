import toast from "react-hot-toast";
import { useCreateArticleMutation } from "../redux/api/AppApi";
import type { ErrorResponse } from "../types/user";

export interface ArticleProps {
    title: string,
    description: string,
    content: string,
    imageUrl: string,
}

const useCreateArticle = () => {
    const [createArticle, { isLoading }] = useCreateArticleMutation();
    const handleUploadArticle = async (article: ArticleProps) => {
        try {
            const response = await createArticle(article).unwrap();
            toast.success(response.message)
        } catch (error) {
            console.log(error);
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
                return;
            }
        }
    }
    return {
        handleUploadArticle,
        isLoading
    }
};

export default useCreateArticle;