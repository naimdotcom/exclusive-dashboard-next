"use client";
import { useGetOrderByIdQuery } from "@/Features/api/Exclusive";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

const page = ({}: Props) => {
  const { slug } = useParams();

  const { data } = useGetOrderByIdQuery(slug);

  console.log(data);
  return <div>page</div>;
};

export default page;
