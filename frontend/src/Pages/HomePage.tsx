import React, { useState } from "react";
import { useSelector } from "react-redux";
import useCreateArticle from "../hooks/useCreateArticle";
import { useGetAllArticlesQuery } from "../redux/api/AppApi";
import useDeleteArticle from "../hooks/useDeleteArticle";
import { selectCurrentUser } from "../redux/slice/authSlice";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

export interface Auth_User {
    _id?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
    accessToken?: string;
}
type User = {
    _id: string
    name: string
    email: string
}

type Article = {
    _id: string
    title: string
    description?: string
    content: string
    imageUrl?: string
    author: User
    createdAt: string
}


export default function HomePage() {
    const currentUser = useSelector(selectCurrentUser)
    const { data } = useGetAllArticlesQuery({}, { refetchOnMountOrArgChange: true });
    console.log(data)
    const articles = data?.articles || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        content: "",
        imageBase64: "",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ imageBase64?: string }>({});

    const { deleteArticle, isArticleDeleting } = useDeleteArticle();
    const { handleUploadArticle, isLoading } = useCreateArticle();


    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteArticle(id);
        setDeletingId(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ imageBase64: "Image size should be less than 5MB" });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const base64Image = reader.result as string;
            setForm((prev) => ({ ...prev, imageBase64: base64Image }));
            setImagePreview(base64Image);
            if (errors.imageBase64) setErrors({});
        };

        reader.onerror = () => {
            setErrors({ imageBase64: "Failed to read image file" });
        };
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error("Title and content are required");
            return;
        }

        const articleData = {
            title: form.title,
            description: form.description,
            content: form.content,
            imageUrl: form.imageBase64,
        };

        await handleUploadArticle(articleData);
        setForm({ title: "", description: "", content: "", imageBase64: "" });
        setImagePreview(null);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Articles</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create Article
                </button>
            </div>

            <div className="grid gap-6">
                {articles.map((article: Article) => (
                    <div
                        key={article._id}
                        className="bg-white shadow rounded-xl p-4 border relative"
                    >
                        {article.imageUrl && (
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-64 object-cover rounded mb-4"
                            />
                        )}
                        <h2 className="text-2xl font-semibold">{article.title}</h2>
                        <p className="text-gray-600">{article.description}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            By {article.author.name} • {new Date(article.createdAt).toLocaleString()}
                        </p>
                        {article.author._id === currentUser?._id && (
                            <button
                                onClick={() => handleDelete(article._id)}
                                disabled={isArticleDeleting}
                                className={`
    absolute top-2 right-2
    flex items-center justify-center
    bg-red-400 p-1 rounded-lg font-bold
    ${isArticleDeleting
                                        ? 'bg-red-600 cursor-not-allowed'
                                        : 'hover:bg-red-700 hover:text-white'}
  `}
                            >
                                {isArticleDeleting && deletingId === article._id
                                    ? <Loader2Icon className="animate-spin h-5 w-5 text-white" />
                                    : 'Delete'}
                            </button>

                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Create Article</h2>

                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full border rounded p-2 mb-3"
                        />

                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full border rounded p-2 mb-3"
                        />

                        <textarea
                            placeholder="Content"
                            value={form.content}
                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                            className="w-full border rounded p-2 mb-3"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-2"
                        />
                        {errors.imageBase64 && (
                            <p className="text-red-500 text-sm mb-2">{errors.imageBase64}</p>
                        )}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`
    w-full flex items-center justify-center
    bg-blue-600 text-white py-2 rounded
    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}
    transition
  `}
                        >
                            {isLoading
                                ? <Loader2Icon className="animate-spin h-5 w-5" />
                                : "Submit"}
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}