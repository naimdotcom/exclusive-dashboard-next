import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  House,
  RectangleHorizontal,
  ListMinus,
  LayoutTemplate,
  TextQuote,
  ShoppingCart,
} from "lucide-react";

const sidebarItem = {
  user: {
    name: "exclusive",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Exclusive",
      logo: GalleryVerticalEnd,
      // plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Banner",
          url: "/home/banner",
          icon: RectangleHorizontal,
        },
        {
          title: "Flash sale",
          url: "/home/flash-sale",
          icon: LayoutTemplate,
        },
        {
          title: "Category",
          url: "/home/category",
          icon: ListMinus,
        },
        {
          title: "Sub-Category",
          url: "/home/sub-category",
          icon: TextQuote,
        },
        // {
        //   title: "Category",
        //   url: "#",
        //   icon: ListMinus,
        // },
      ],
    },
    {
      title: "Exclusive",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Product",
          url: "#",
          icon: ShoppingCart,
        },
        {
          title: "Category",
          url: "#",
          icon: ListMinus,
        },
        {
          title: "Sub-Category",
          url: "#",
          icon: TextQuote,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const bannerTableData: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

export { sidebarItem, bannerTableData };
