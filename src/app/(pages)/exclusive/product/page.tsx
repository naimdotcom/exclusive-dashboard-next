"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useGetSubCategoryQuery,
} from "@/Features/api/Exclusive";
import { Category } from "../../home/category/page";
import { subCategory } from "../../home/sub-category/page";
import { cn } from "@/lib/utils";
import { Eye, Heart, Star } from "lucide-react";
import Link from "next/link";
import StarReview from "@/components/common/Star";
import { Button } from "@/components/ui/button";

type Props = {};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subCategory: string;
  image: File[] | string[];
  discount: number;
  rating: number;
  reviews: number;
};

const Page = ({}: Props) => {
  const [productData, setProductData] = React.useState<Product>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    subCategory: "",
    image: [],
    discount: 0,
    rating: 0,
    reviews: 0,
    _id: "",
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const { data: categories } = useGetAllCategoriesQuery({});
  const { data: subCategories } = useGetSubCategoryQuery({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files).slice(0, 4);
      setProductData((prev) => ({ ...prev, image: selectedImages }));
    }
  };

  const handleSubmit = async () => {};

  return (
    <div>
      <div className={cn("flex flex-col gap-6")}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Product Name</Label>
          <Input
            type="text"
            id="name"
            className="w-full"
            placeholder="Product Name"
            onChange={handleInputChange}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            className="min-h-[200px] w-full"
            placeholder=":"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid w-full grid-cols-4 items-center gap-1.5">
          <div>
            <Label htmlFor="price">Product Price</Label>
            <Input
              type="number"
              id="price"
              className="w-full"
              placeholder="Product Price"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Product Quantity</Label>
            <Input
              type="number"
              id="quantity"
              className="w-full"
              placeholder="Product Quantity"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="discount">Product Discount</Label>
            <Input
              type="number"
              id="discount"
              className="w-full"
              placeholder="Product Discount"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="rating">Product Rating</Label>
            <Input
              type="number"
              id="rating"
              className="w-full"
              placeholder="Product Rating"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-3 items-center gap-1.5">
          <div>
            <Label htmlFor="image">Upload Product Images (Max: 4)</Label>
            <Input
              id="image"
              accept="image/*"
              type="file"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div>
            <Label htmlFor="category">Product Category</Label>
            <Select
              onValueChange={(value) =>
                setProductData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories?.data.map((category: Category) => (
                    <SelectItem value={category._id} key={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subCategory">Product Sub Category</Label>
            <Select
              onValueChange={(value) =>
                setProductData((prev) => ({ ...prev, subCategory: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sub Categories</SelectLabel>
                  {subCategories?.data.map((subCategory: subCategory) => (
                    <SelectItem value={subCategory._id} key={subCategory._id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Button className="w-full mt-4" onClick={handleSubmit}>
            {createLoading ? "Creating..." : "Create Banner"}
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Preview</h2>
        {productData.name && (
          <div
            key={productData._id}
            className="space-y-4 shadow-lg w-fit rounded"
          >
            <div className="relative px-16 py-16 rounded bg-cs-white_F5F5F5 w-72 h-72 max-w-72 max-h-72 group">
              <div className="px-3 py-[6px] rounded bg-cs-redDB4444 w-fit absolute top-2 left-2">
                <h4 className="text-xs font-normal leading-none text-center text-cs-white_FFFFFF font-poppins">
                  -{productData.discount ? productData.discount : 0}%
                </h4>
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <picture className="w-full h-full">
                  <img
                    src={
                      productData?.image[0]
                        ? URL.createObjectURL(productData.image[0] as Blob)
                        : ""
                    }
                    alt="Product Preview"
                    className="w-full h-full object-contain"
                  />
                </picture>
              </div>
              <div className="absolute z-30 space-y-2 top-2 right-2">
                <h4 className="p-2 bg-white rounded-full ">
                  <Heart className="text-2xl text-gray-700" />
                </h4>
                <h4 className="p-2 bg-white rounded-full">
                  <Link href={`#`}>
                    <Eye className="text-2xl text-gray-700" />
                  </Link>
                </h4>
              </div>
              <div className="absolute bottom-0 left-0 z-30 w-full space-y-2 text-center duration-500 opacity-0 group-hover:opacity-100">
                <div
                  className="w-full py-3 bg-black rounded-bl rounded-br cursor-pointer"
                  onClick={() => console.log("add to cart")}
                >
                  <h3 className="text-white text-base font-medium font-['Poppins'] leading-normal">
                    Add to Cart
                  </h3>
                </div>
              </div>
            </div>
            <div className="space-y-2 px-4 pb-3">
              <h1 className="pt-2 text-base font-medium text-black font-poppins">
                {productData.name}
              </h1>
              <h4 className="flex items-start justify-start h-6 gap-3">
                <span className="text-base font-medium leading-normal text-cs-redDB4444 font-poppins">
                  ${productData.price}
                  {/* {useCalculateDiscount(
                    productData.price,
                    productData.discount
                  ).toFixed(2)} */}
                </span>
                <span className="text-base font-medium leading-normal text-black line-through opacity-50 font-poppins">
                  ${productData.price}
                </span>
              </h4>
              <div className="flex items-center gap-2">
                {productData.rating && (
                  <StarReview rating={productData.rating} />
                )}
                <h4 className="w-8 h-5 text-sm font-semibold text-black opacity-50 font-poppins">
                  {productData.reviews > 0 ? `(${productData.reviews})` : 0}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
