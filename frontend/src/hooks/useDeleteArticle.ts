
import toast from "react-hot-toast";
import type { ErrorResponse } from "react-router-dom";
import { useDeleteArticleMutation } from "../redux/api/AppApi";

const useDeleteArticle = () => {
    const [deletedUser, { isLoading: isArticleDeleting }] = useDeleteArticleMutation()
    const deleteArticle = async (id: string) => {
        try {
            const response = await deletedUser(id).unwrap();
            toast.success(response.message);
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    }

    return {
        deleteArticle,
        isArticleDeleting
    }
}


export default useDeleteArticle