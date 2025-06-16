import { apiSlice } from "./EntryApi";



export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        logout: builder.query({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
        }),
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/registration",
                method: "POST",
                body: credentials,
            }),
        }),

        createArticle: builder.mutation({
            query: (credentials) => ({
                url: "/create-article",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Articles"],
        }),
        getAllArticles: builder.query({
            query: () => ({
                url: "/get-articles",
                method: "GET",
            }),
            providesTags: ["Articles"],
        }),
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `/delete-article/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Articles"],
        }),

    })

});





export const { useLoginMutation, useLazyLogoutQuery, useSignInMutation,
    useCreateArticleMutation, useGetAllArticlesQuery, useDeleteArticleMutation } = authApi;
