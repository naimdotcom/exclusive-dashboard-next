"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorToast, successToast } from "@/utils/Toast/toast";
import { useState } from "react";

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
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/Features/api/Exclusive";
import { DataTable } from "@/components/dataTable/FilterTable";

export type Category = {
  _id: string;
  image: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  product: string[]; // todo: change to product type
  subCategory: string[]; // todo: change to subCategory type
};

export const categoryColumns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("_id")}</div>,
  },
  // title
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="mr-2">Name</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  // data
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
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
        <div className="capitalize">
          {DateD} - {time}
        </div>
      );
    },
  },
  // image
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.getValue("image")}
        alt="Banner"
        className="h-24 w-24 shadow object-cover rounded-md"
      />
    ),
  },
  // actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original;
      const { _id } = banner;
      const [deleteItem] = useDeleteCategoryMutation();
      return (
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
                    successToast({ message: "category Deleted Successfully" });
                    successToast({ message: "Refresh the page" });
                  })
                  .catch((err) => {
                    console.log(err);
                    errorToast({ message: "something went wrong" });
                  });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type Props = {};

const page = ({}: Props) => {
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<string | null>();
  const [imageLoc, setImageLoc] = useState<File | null>();
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const { data, refetch } = useGetAllCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setFile(URL.createObjectURL(file)); // Create a preview URL
      setImageLoc(file);
    }
  };

  const handleSubmit = async () => {
    setCreateLoading(true);
    if (!title || !imageLoc) {
      errorToast({ message: "Please fill all the fields" });
      setCreateLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", title);
    formData.append("image", imageLoc ? imageLoc : "");

    formData.forEach((value, key) => console.log(key, value));

    await createCategory(formData)
      .unwrap()
      .then((res) => {
        successToast({ message: "Category Created Successfully" });
        setTitle("");
        setFile(null);
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

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex flex-col w-1/3 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Category Name</Label>
            <Input
              type="text"
              id="title"
              placeholder="Category Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Category Picture</Label>
            <Input
              id="picture"
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 w-4/6">
          <h2>Preview</h2>
          <div>
            {file && title ? (
              <div className="flex justify-center flex-col">
                <img
                  src={file}
                  alt="category"
                  className="h-16 w-16 shadow object-cover rounded-md"
                />
                <h1 className="text-gray-600 mx-4 text-md ">{title}</h1>
              </div>
            ) : (
              <h1 className="text-gray-600 mx-4 text-md ">
                choose thumbail first
              </h1>
            )}
          </div>
        </div>
      </div>
      <div>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          {createLoading ? "Creating..." : "Create Banner"}
        </Button>
      </div>

      <div className="mt-10 ">
        table
        <div>
          <DataTable<Category>
            data={data?.data ? data?.data : []}
            columns={categoryColumns}
            searchId="name"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
