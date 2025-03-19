"use client";
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSubCategoryQuery,
} from "@/Features/api/Exclusive";
import React, { useEffect, useState } from "react";
import { Category } from "../category/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dataTable/FilterTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { errorToast, successToast } from "@/utils/Toast/toast";

type Props = {};

export type subCategory = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  product: string[]; // todo: change to product type
  category: Category[]; // todo: change to subCategory type
};

export const subCategoryColumns: ColumnDef<subCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="text-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("_id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full flex justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="mr-2">Sub Category</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full flex justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Category</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const categories = row.getValue("category") as Category;
      return <div className="text-center capitalize">{categories.name}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full flex justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="mr-2">Date</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const DateD = date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return (
        <div className="text-center capitalize">
          {DateD} - {time}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original;
      const { _id } = banner;
      const [deleteItem] = useDeleteSubCategoryMutation();
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(banner._id)}
              >
                Copy Banner ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteItem(_id)
                    .then(() => {
                      successToast({
                        message: "Category Deleted Successfully",
                      });
                      successToast({ message: "Refresh the page" });
                    })
                    .catch((err) => {
                      console.log(err);
                      errorToast({ message: "Something went wrong" });
                    });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const page = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<[]>([]);

  const { data, refetch } = useGetSubCategoryQuery({});
  const { data: categories } = useGetAllCategoriesQuery({});
  const [createSubCategory] = useCreateSubCategoryMutation();
  const handleSubmit = async () => {
    setCreateLoading(true);
    if (!title || !categoryId) {
      errorToast({ message: "Please fill all the fields" });
      setCreateLoading(false);
      return;
    }
    const formData = {
      name: title,
      categoryId: categoryId,
    };

    console.log(formData);

    await createSubCategory(formData)
      .unwrap()
      .then((res) => {
        successToast({ message: "Category Created Successfully" });
        setTitle("");
        refetch();
      })
      .catch((err) => {
        errorToast({
          message: err.data.message
            ? err.data.message
            : "something went wrong while creating category",
        });
        console.log("error in create category", err);
      })
      .finally(() => setCreateLoading(false));
  };

  console.log(data);

  useEffect(() => {
    if (categories) {
      setCategory(categories.data);
    }
  }, [categories]);

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex gap-4 w-full">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Category Name</Label>
            <Input
              type="text"
              id="title"
              placeholder="Category Title"
              className="w-full"
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Category Name</Label>
            <Select onValueChange={(e) => setCategoryId(e)}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Category"
                  className="w-full capitalize"
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {category.length &&
                  category.map((item: any) => (
                    <SelectItem
                      value={item._id}
                      className="capitalize"
                      key={item._id}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          {createLoading ? "Creating..." : "Create subcategory"}
        </Button>
      </div>
      <div className="mt-10 ">
        table
        <div>
          <DataTable<subCategory>
            data={data?.data ? data?.data : []}
            columns={subCategoryColumns}
            searchId="name"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
