"use client";
import React from "react";

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
import { subCategory } from "../../home/sub-category/page";
import { Button } from "@/components/ui/button";
import { Product } from "../product/page";
import { DataTable } from "@/components/dataTable/FilterTable";
import { useGetAllProductQuery } from "@/Features/api/Exclusive";
import truncateWords from "@/utils/truncateWords";

type Props = {};

// export type product = {
//   _id: string;
//   image: string;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   product: string[]; // todo: change to product type
//   subCategory: subCategory[]; // todo: change to subCategory type
//   price: number;
//   rating: number;
// };

export const productColumns: ColumnDef<Product>[] = [
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

  // title
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Name</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button className="w-full flex justify-center" variant="ghost">
        <span>Description</span>
      </Button>
    ),
    cell: ({ row }) => {
      const text = truncateWords(row.getValue("description"), 10);
      return <div className="text-center">{text}...</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Price</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("price")}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Stock</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("stock")}</div>
    ),
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Discount</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("discount")}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Rating</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("rating")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Date</span>
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
      const product = row.original;
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
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const page = ({}: Props) => {
  const { data } = useGetAllProductQuery({});
  return (
    <div>
      <div className="mt-10 ">
        table
        <div>
          <DataTable<Product>
            data={data?.data ? data?.data : []}
            columns={productColumns}
            searchId="name"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
