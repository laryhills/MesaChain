import {
    AiOutlineHome,
    AiOutlineShoppingCart,
    AiOutlineMenu,
    AiOutlineTeam,
    AiOutlineTransaction,
    AiOutlineAreaChart,
    AiOutlineHistory,
    AiOutlineUser,
    AiOutlineSetting,
  } from "react-icons/ai";
  
  export const navItems = [
    { href: "/dashboard", icon: AiOutlineHome, title: "Dashboard" },
    { href: "/pos", icon: AiOutlineShoppingCart, title: "POS" },
    { href: "/menu", icon: AiOutlineMenu, title: "Menu" },
    { href: "/staff", icon: AiOutlineTeam, title: "Staff" },
    {
      href: "/transactions",
      icon: AiOutlineTransaction,
      title: "Transactions",
    },
    { href: "/analytics", icon: AiOutlineAreaChart, title: "Analytics" },
    {
      href: "/orders-history",
      icon: AiOutlineHistory,
      title: "Orders History",
    },
    { href: "/customers", icon: AiOutlineUser, title: "Customers" },
    { href: "/settings", icon: AiOutlineSetting, title: "Settings" },
  ];