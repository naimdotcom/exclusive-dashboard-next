"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Product } from "../product/page";
import { DataTable } from "@/components/dataTable/FilterTable";
import truncateWords from "@/utils/truncateWords";
import { useGetAllOrderQuery } from "@/Features/api/Exclusive";
import { cn } from "@/lib/utils";

export type cartItem = {
  product: string;
  quantity: number;
  productPrice: number;
  totalPrice: number;
  productSize?: string;
  productColor?: string;
  productDiscount: number;
  _id?: string;
};

export type paymentinfo = {
  id: string;
  tran_id: string;
  paymentmethod: string;
  ispaid: boolean;
};

export type order = {
  _id: string;
  user: {};
  customerinfo: {};
  status: string;
  paymentinfo: paymentinfo;
  cartItem: cartItem[];
  createdAt: string;
  totalPrice: number;
};

export const orderColumns: ColumnDef<order>[] = [
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

  // paymentinfo
  {
    accessorKey: "paymentinfo",
    header: ({ column }) => (
      <Button
        className=""
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Order ID</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const payInfo = row.getValue("paymentinfo") as paymentinfo;
      return <div className="px-4">{payInfo?.tran_id}</div>;
    },
  },
  // total price
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <Button className="w-full flex justify-center" variant="ghost">
        <span>Price</span>
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalPrice")}</div>
    ),
  },
  // email
  {
    accessorKey: "user",
    header: ({ column }) => (
      <Button className="w-full flex justify-center" variant="ghost">
        <span>Email and Phone number</span>
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.getValue("user") as any;
      return (
        <div>
          <div className="text-center">{user?.email}</div>
          <div className="text-center">{user?.phoneNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Status</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center w-full">
        {/* ["pending", "processing", "deliverd", "cancel"] */}
        <Button
          variant="default"
          className={cn(
            "w-fit px-2 hover:bg-transparent hover:text-black",
            row.getValue("status") === "pending" && "bg-red-100 text-red-600 ",
            row.getValue("status") === "processing" &&
              "bg-orange-100 text-orange-600",
            row.getValue("status") === "deliverd" &&
              "bg-green-100 text-green-600",
            row.getValue("status") === "cancel" && "bg-gray-600"
          )}
        >
          {row.getValue("status")}
        </Button>
      </div>
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
      //   const [deleteProduct] = useDeleteProductByIdMutation();
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
            <a href={`/exclusive/order/${product._id}`}>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </a>
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

type Props = {};
const statusOptions = ["pending", "processing", "deliverd", "cancel"];
const dateOptions = ["Today", "This Week", "This Month", "This Year"];

const filterByDate = (orders: order[], filter: string) => {
  const now = new Date();
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    switch (filter) {
      case "Today":
        return orderDate.toDateString() === now.toDateString();
      case "This Week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return orderDate >= startOfWeek;
      case "This Month":
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      case "This Year":
        return orderDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
};

const page = (props: Props) => {
  const { data } = useGetAllOrderQuery({});
  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>(statusOptions);
  const [selectedDate, setSelectedDate] = useState<string>("All");
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredData =
    data?.data?.filter(
      (order: order) =>
        selectedStatuses.includes(order.status) &&
        (selectedDate === "All" || filterByDate([order], selectedDate).length)
    ) || [];

  return (
    <div>
      <div className="mt-10">
        <div className="flex items-center gap-x-4">
          <h1>Order List</h1>
        </div>

        <div>
          <DataTable<order>
            data={filteredData}
            columns={orderColumns}
            searchId="paymentinfo"
            filterChildren={
              <div className="flex gap-4 my-4">
                {filterComp(selectedStatuses, toggleStatus)}
                {dateFilter(selectedDate, setSelectedDate)}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

const dateFilter = (selectedDate: string, setSelectedDate: any) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        Filter Date <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuLabel>Date Filters</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {dateOptions.map((date) => (
        <DropdownMenuItem key={date} onSelect={() => setSelectedDate(date)}>
          <Checkbox
            checked={selectedDate === date}
            onCheckedChange={() => setSelectedDate(date)}
          />
          <span className="ml-2">{date}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
const filterComp = (selectedStatuses: string[], toggleStatus: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filter Status <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Status Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((status) => (
          <DropdownMenuItem key={status} onSelect={() => toggleStatus(status)}>
            <Checkbox
              checked={selectedStatuses.includes(status)}
              onCheckedChange={() => toggleStatus(status)}
            />
            <span className="ml-2">{status}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default page;
