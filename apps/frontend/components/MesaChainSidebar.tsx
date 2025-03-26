"use client";
import { FC, useState, useEffect, useCallback } from "react";
import SidebarHeader from "./SideBar/SidebarHeader";
import SidebarNavigation from "./SideBar/SidebarNavigation";
import SidebarUserProfile from "./SideBar/SidebarUserProfile";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const MesaChainSidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showText, setShowText] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
        const savedTextDisplay = localStorage.getItem("sidebarShowText");
        if (savedTextDisplay) {
          setShowText(savedTextDisplay === "true");
        }
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {

      const newTextState = !showText;
      setShowText(newTextState);
      localStorage.setItem("sidebarShowText", String(newTextState));
    }
  }, [isMobile, isOpen, showText]);

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed flex top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 md:hidden items-center justify-between px-4 z-30">
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
        <SidebarHeader
          isOpen={isOpen}
          isMobile={isMobile}
          showText={showText}
          toggleSidebar={toggleSidebar}
        />

        <SidebarNavigation showText={showText} />
        <SidebarUserProfile showText={showText} />
      </aside>

      {/* Main content area */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? (showText ? "md:ml-64" : "md:ml-20") : "ml-0"
        }`}
      >
        {/* Your page content goes here */}
      </main>

      {/* Mobile overlay */}
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
export default MesaChainSidebar;
