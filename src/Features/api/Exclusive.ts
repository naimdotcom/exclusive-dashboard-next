import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { create } from "domain";
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
    createCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/v1/category",
        method: "POST",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation<any, any>({
      query: (id) => ({
        url: `/v1/category/${id}`,
        method: "DELETE",
      }),
    }),
    getSubCategory: builder.query<any, any>({
      query: () => "/v1/subcategory",
    }),
    createSubCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/v1/subcategory",
        method: "POST",
        body: data,
      }),
    }),
    deleteSubCategory: builder.mutation<any, any>({
      query: (id) => ({
        url: `/v1/subcategory/${id}`,
        method: "DELETE",
      }),
    }),

    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: "/v1/product",
        method: "POST",
        body: data,
      }),
    }),
    getProductById: builder.query<any, any>({
      query: (id) => `/v1/product/${id}`,
    }),
    updateProductById: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/v1/product/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateProductImageById: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/v1/product/${id}`,
        method: "PATCH",
        body: data,
      }),
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
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoryQuery,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUpdateProductImageByIdMutation,
} = exclusiveApi;
