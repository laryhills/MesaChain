"use client";
import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  AiOutlineClose,
} from "react-icons/ai";
import { IconType } from "react-icons";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface NavItemProps {
  href: string;
  icon: IconType;
  title: string;
  isActive: boolean;
  showText: boolean;
}

const NavItem: FC<NavItemProps> = ({
  href,
  icon: Icon,
  title,
  isActive,
  showText,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center ${showText ? "px-4" : "justify-center"} py-3 mx-2 my-1 rounded-md transition-colors ${
        isActive
          ? "bg-green-50 text-green-500"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      aria-current={isActive ? "page" : undefined}
      title={!showText ? title : undefined}
    >
      <Icon className={`text-xl flex-shrink-0 ${showText ? "mr-3" : ""}`} />
      {showText && <span className="text-sm font-medium">{title}</span>}
    </Link>
  );
};

const EnhancedSidebar: FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [showText, setShowText] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);  <button
        type="button"
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
        aria-expanded={isOpen}
        aria-controls="sidebar"
        aria-label="Toggle navigation menu"
      >
        {isOpen && isMobile ? (
          <AiOutlineClose className="text-xl" />
        ) : (
          <AiOutlineMenu className="text-xl" />
        )}
      </button>
      } else {
        setIsOpen(true);
        // Check for saved text display preference on desktop
        const savedTextDisplay = localStorage.getItem("sidebarShowText");
        if (savedTextDisplay) {
          setShowText(savedTextDisplay === "true");
        }
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
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

  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile, toggle between fully open and fully closed
      setIsOpen(!isOpen);
    } else {
      // On desktop, toggle between expanded (with text) and collapsed (icons only)
      const newTextState = !showText;
      setShowText(newTextState);
      localStorage.setItem("sidebarShowText", String(newTextState));
    }
  };

  return (
    <>
      <header className="fixed  flex top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 md:hidden items-center justify-between px-4 z-30">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <div className="h-10 w-10 rounded-md bg-green-500 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            {(showText || isMobile) && (
              <span className="ml-2 text-xl font-semibold">MesaChain</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
          aria-expanded={isOpen}
          aria-controls="sidebar"
          aria-label="Toggle navigation menu"
        >
          {isOpen && isMobile ? (
            <AiOutlineClose className="text-xl" />
          ) : (
            <AiOutlineMenu className="text-xl" />
          )}
        </button>
      </header>
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20 ${
          isOpen
            ? showText
              ? "w-64 translate-x-0"
              : "w-20 translate-x-0"
            : "w-0 -translate-x-full"
        } overflow-hidden`}
        aria-label="Main navigation"
      >
        <header className="hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 md:flex items-center justify-between px-4 z-30">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <div className="h-10 w-10 rounded-md bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              {(showText || isMobile) && (
                <span className="ml-2 text-xl font-semibold">MesaChain</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
            aria-expanded={isOpen}
            aria-controls="sidebar"
            aria-label="Toggle navigation menu"
          >
            {isOpen && isMobile ? (
              <AiOutlineClose className="text-xl" />
            ) : (
              <AiOutlineMenu className="text-xl" />
            )}
          </button>
        </header>



        <nav className="mt-20 overflow-y-auto h-[calc(100%-124px)]">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={pathname === item.href}
                  showText={showText}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile section */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t border-gray-200 py-3 px-4 bg-white ${
            !showText ? "justify-center" : ""
          } flex items-center`}
        >
          <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
          {showText && (
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">
                Alexa Laza
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Content area with top padding to prevent overlap with header */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? (showText ? "md:ml-64" : "md:ml-20") : "ml-0"
        }`}
      >
        {/* Your page content goes here */}
      </main>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default EnhancedSidebar;
