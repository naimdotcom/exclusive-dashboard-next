"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import {
  useCreateProductMutation,
  useGetAllCategoriesQuery,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUpdateProductImageByIdMutation,
} from "@/Features/api/Exclusive";
import { Category } from "../../home/category/page";
import { subCategory } from "../../home/sub-category/page";
import { cn } from "@/lib/utils";
import { Eye, Heart, Plus, X } from "lucide-react";
import Link from "next/link";
import StarReview from "@/components/common/Star";
import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/utils/Toast/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

type Props = {};

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
  size: string[];
};

const Page = ({}: Props) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [productData, setProductData] = React.useState<Product>({
    size: [],
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
  const [images, setImages] = useState<(string | File)[]>([]);
  const [deletedImage, setDeletedImage] = useState<string[]>([]);
  const [updatedImageFile, setUpdatedImageFile] = useState<File[]>([]);
  const [subcategory, setSubcategory] = useState<[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { data: categories } = useGetAllCategoriesQuery({});
  const [createProduct] = useCreateProductMutation();
  const [updateProductByID] = useUpdateProductByIdMutation();
  const [updateProductImageByID] = useUpdateProductImageByIdMutation();
  const { data: productQuery } = useGetProductByIdQuery(id);

  const clearForm = () => {
    setProductData({
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
      size: [],
    });
    setSelectedSizes([]);
  };

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

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= 4) {
      errorToast({ message: "You can't upload more than 4 images" });
    } else if (e.target.files && images.length < 4) {
      const selectedImages = Array.from(e.target.files).slice(
        0,
        4 - images.length
      );
      setImages((prev) => [...prev, ...selectedImages]);
      setUpdatedImageFile(selectedImages);
    }
  };

  const handleDeleteImage = (image: string | File, index: number) => {
    if (typeof image === "string") {
      setDeletedImage((prev) => [...prev, image]);
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setUpdatedImageFile((prev) => prev.filter((im) => im !== image));
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

  const handleContentUpdate = async () => {
    if (
      !productData.name ||
      !productData.description ||
      productData.price <= 0 ||
      productData.stock <= 0 ||
      !productData.category ||
      !productData.subCategory ||
      productData.discount < 0 ||
      productData.rating < 0 ||
      selectedSizes.length === 0
    ) {
      errorToast({ message: "Please fill all the required fields correctly" });
      setCreateLoading(false);
      return;
    }

    const data = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      rating: productData.rating,
      stock: productData.stock,
      size: productData.size,
      color: productData.color,
      category: productData.category,
      subcategory: productData.subCategory,
      discount: productData.discount,
    };

    await updateProductByID({
      id: id,
      data: data,
    })
      .then((res) => {
        successToast({ message: "Product Updated Successfully" });
        console.log("product updated", res);
      })
      .catch((err) => {
        errorToast({
          message: err.data.message
            ? err.data.message
            : "something went wrong while updating product",
        });
        console.log("error in update product", err);
      });
  };

  const handleImageUpdate = async () => {
    const formData = new FormData();
    updatedImageFile.forEach((image) => {
      formData.append("image", image);
    });
    deletedImage.forEach((image) => {
      formData.append("imageInfo", image);
    });

    await updateProductImageByID({
      id: id,
      data: formData,
    })
      .then((res) => {
        successToast({ message: "Product Updated Successfully" });
        console.log("product updated", res);
      })
      .catch((err) => {
        errorToast({
          message: err.data.message
            ? err.data.message
            : "something went wrong while updating product",
        });
        console.log("error in update product", err);
      });
  };

  useEffect(() => {
    if (id && productQuery?.data) {
      setProductData({
        name: productQuery.data.name,
        description: productQuery.data.description,
        price: productQuery.data.price,
        stock: productQuery.data.stock,
        category: productQuery.data.category,
        subCategory: productQuery.data.subcategory,
        image: productQuery.data.images,
        discount: productQuery.data.discount,
        rating: productQuery.data.rating,
        reviews: productQuery.data.review,
        _id: productQuery.data._id,
        color: productQuery.data.color,
        size: productQuery.data.size,
      });
      setImages(productQuery.data.images);
      setSelectedSizes(productQuery.data.size);
    }
  }, [id, productQuery]);

  useEffect(() => {
    if (productData.category) {
      const selectedCategory = categories?.data.find(
        (c: Category) => c._id === productData.category
      );
      setSubcategory(selectedCategory?.subCategory || []);
    }
  }, [categories, productData.category]);

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
            value={productData.name}
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
            value={productData.description}
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
              value={productData.price}
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
              value={productData.stock}
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
              value={productData.discount}
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label htmlFor="rating">
              Product Rating <span className="text-red-500">*</span>
            </Label>
            {/* <Input
              type="number"
              id="rating"
              className="w-full"
              placeholder="Product Rating"
              onChange={handleInputChange}
              value={productData.rating}
            /> */}
            <div className="flex items-center gap-2 ">
              <div className="text-sm border border-gray-400 px-1.5 py-2 rounded-md leading-none">
                {productData.rating
                  ? productData.rating % 1 == 0
                    ? `${productData.rating}.0`
                    : productData.rating
                  : 1}
              </div>
              <Slider
                defaultValue={[productData.rating ? productData.rating : 1.0]}
                max={5}
                min={1}
                step={0.5}
                onValueChange={(value: number[]) => {
                  setProductData((prev) => ({
                    ...prev,
                    rating: value[0],
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={cn("grid w-full grid-cols-3 items-center gap-1.5", {
            "grid-cols-2": id,
          })}
        >
          {/* image */}
          {!id && (
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
          )}
          {/* category */}
          <div>
            <Label htmlFor="category">
              Product Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={productData.category}
              onValueChange={(value) => {
                setProductData((prev) => ({ ...prev, category: value }));
                setSubcategory(
                  categories?.data.find((c: Category) => c._id === value)
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
                    <SelectItem
                      defaultChecked={category._id == productData.category}
                      value={category._id}
                      key={category._id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* sub category */}
          <div>
            <Label htmlFor="subCategory">
              Product Sub Category <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setProductData((prev) => ({ ...prev, subCategory: value }))
              }
              disabled={!productData.category}
              value={productData?.subCategory}
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
                    checked={
                      productData.size.includes(size) ||
                      selectedSizes.includes(size)
                    }
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
              value={productData.color}
            />
          </div>
        </div>

        <div>
          <Button
            className="w-full mt-4"
            onClick={() => {
              id ? handleContentUpdate() : handleSubmit();
            }}
          >
            {id
              ? "Update Product"
              : createLoading
              ? "Creating..."
              : "Create Product"}
          </Button>
        </div>

        {id && (
          <div className="space-y-4">
            <Label htmlFor="image">Product Image</Label>
            <div className={cn("grid grid-cols-5 gap-1.5")}>
              {images.map((image, index) => {
                const imageUrl =
                  typeof image === "string"
                    ? image
                    : URL.createObjectURL(image);
                const isDeleted = deletedImage.includes(imageUrl);

                return (
                  <div key={imageUrl} className="relative">
                    <img
                      src={imageUrl}
                      alt="Product"
                      className="h-44 w-96 shadow object-cover rounded-md"
                    />
                    {isDeleted ? (
                      <span
                        className="absolute -top-2 -right-2 bg-red-500 p-1 text-white rounded-full cursor-pointer"
                        onClick={() => {
                          setDeletedImage((prev) =>
                            prev.filter((i) => i !== imageUrl)
                          );
                        }}
                      >
                        <Plus size={14} />
                      </span>
                    ) : (
                      <span
                        className="absolute -top-2 -right-2 bg-red-500 p-1 text-white rounded-full cursor-pointer"
                        onClick={() => handleDeleteImage(image, index)}
                      >
                        <X size={14} />
                      </span>
                    )}
                  </div>
                );
              })}
              {images.length < 4 && (
                <Input
                  id="image"
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleUpdateImageChange}
                  className={cn("ml-4")}
                />
              )}
            </div>
          </div>
        )}

        {id && (
          <div>
            <Button className="w-full mt-4" onClick={handleImageUpdate}>
              update Image
            </Button>
          </div>
        )}
      </div>

      {/* preview */}
      {id ? (
        ""
      ) : (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex">
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
                    {/* <picture className="w-full h-full">
                    <img
                      src={
                        typeof productData.image. 
                          ? URL.createObjectURL(productData.image[0] as Blob)
                          : ""
                      }
                      alt="Product Preview"
                      className="w-full h-full object-contain"
                    />
                  </picture> */}
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

            {productData.image.length > 0 && false && (
              <div className="flex gap-7 px-4 rounded py-2 shadow-md">
                {productData.image.map((image, index) => (
                  <div key={index + image.toString()}>
                    <picture>
                      <img
                        className="w-28 h-28 object-contain"
                        src={URL.createObjectURL(image as Blob)}
                        alt=""
                      />
                    </picture>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
