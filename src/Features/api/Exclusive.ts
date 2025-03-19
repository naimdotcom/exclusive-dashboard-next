import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Delete } from "lucide-react";

const exclusiveApi = createApi({
  reducerPath: "exclusiveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllProduct: builder.query<any, any>({
      query: () => "/v1/product",
    }),
    getBanner: builder.query<any, any>({
      query: () => "/v1/banner",
    }),
    CreateBanner: builder.mutation<any, any>({
      query: (data) => ({
        url: "/v1/banner",
        method: "POST",
        body: data,
      }),
    }),
    DeleteBanner: builder.mutation<any, any>({
      query: (id) => ({
        url: `/v1/banner/${id}`,
        method: "DELETE",
      }),
    }),
    getAllCategories: builder.query<any, any>({
      query: () => "/v1/category",
    }),
  }),
});

export default exclusiveApi;

export const {
  useGetAllProductQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllCategoriesQuery,
} = exclusiveApi;
