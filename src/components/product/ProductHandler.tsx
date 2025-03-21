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
  useCreateProductMutation,
  useGetAllCategoriesQuery,
} from "@/Features/api/Exclusive";
import { Category } from "@/app/(pages)/home/category/page";
import { subCategory } from "@/app/(pages)/home/sub-category/page";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/utils/Toast/toast";
import { Checkbox } from "@/components/ui/checkbox";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string;
  image: File[] | string[];
  discount: number;
  rating: number;
  reviews: number;
  color: string;
};

type Props = {
  _id?: string | undefined;
};

const ProductHandler = ({ _id }: Props) => {
  const [productData, setProductData] = React.useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    subCategory: "",
    image: [],
    discount: 0,
    rating: 0,
    reviews: 0,
    _id: "",
    color: "",
  });
  const [subcategory, setSubcategory] = useState<[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S"]);
  const { data: categories } = useGetAllCategoriesQuery({});
  const [createProduct] = useCreateProductMutation();

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

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

  const handleSubmit = async () => {
    setCreateLoading(true);
    if (
      !productData.name ||
      !productData.description ||
      productData.price <= 0 ||
      productData.stock <= 0 ||
      !productData.category ||
      !productData.subCategory ||
      productData.image.length === 0 ||
      productData.discount < 0 ||
      productData.rating < 0 ||
      selectedSizes.length === 0
    ) {
      errorToast({ message: "Please fill all the required fields correctly" });
      setCreateLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());
    formData.append("rating", productData.rating.toString());
    selectedSizes.forEach((size) => formData.append("size", size));
    formData.append("color", productData.color);
    formData.append("categoryId", productData.category);
    formData.append("subcategoryId", productData.subCategory);
    formData.append("quantity", productData.stock.toString());
    formData.append("discount", productData.discount.toString());
    productData.image.forEach((image) => formData.append("image", image));

    await createProduct(formData)
      .unwrap()
      .then((res) => {
        successToast({ message: "Product Created Successfully" });
        console.log(res);
      })
      .catch((err) => {
        errorToast({
          message: err.data.message
            ? err.data.message
            : "something went wrong while creating product",
        });
        console.log(err);
      })
      .finally(() => setCreateLoading(false));
  };
  return (
    <div>
      <div className={cn("flex flex-col gap-6")}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            className="w-full"
            placeholder="Product Name"
            onChange={handleInputChange}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">
            Product Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            className="min-h-[200px] w-full"
            placeholder=":"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid w-full grid-cols-4 items-center gap-1.5">
          <div>
            <Label htmlFor="price">
              Product Price <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="price"
              className="w-full"
              placeholder="Product Price"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="stock">
              Product Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="stock"
              className="w-full"
              placeholder="Product Quantity"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="discount">
              Product Discount <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="discount"
              className="w-full"
              placeholder="Product Discount"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="rating">
              Product Rating <span className="text-red-500">*</span>
            </Label>
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
            <Label htmlFor="image">
              Upload Product Images (Max: 4){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              accept="image/*"
              type="file"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div>
            <Label htmlFor="category">
              Product Category <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => {
                setProductData((prev) => ({ ...prev, category: value }));
                setSubcategory(
                  categories?.data.filter((c: Category) => c._id == value)?.[0]
                    .subCategory
                );
              }}
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
            <Label htmlFor="subCategory">
              Product Sub Category <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setProductData((prev) => ({ ...prev, subCategory: value }))
              }
              disabled={!productData.category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sub Categories</SelectLabel>
                  {subcategory?.map((subCategory: subCategory) => (
                    <SelectItem value={subCategory._id} key={subCategory._id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5 grid-cols-2">
          <div>
            <Label>Product Sizes</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {["XS", "S", "L", "M", "XL", "XXL"].map((size) => (
                <div className="flex items-center space-x-2" key={size}>
                  <Checkbox
                    id={size}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeChange(size)} // ✅ Fix here
                  />
                  <Label
                    htmlFor={size}
                    className="text-sm font-medium leading-none"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="color">Product color</Label>
            <Input
              type="text"
              id="color"
              className="w-full"
              placeholder="Product color"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Button className="w-full mt-4" onClick={handleSubmit}>
            {createLoading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductHandler;
