import { FC } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface SidebarHeaderProps {
  isOpen: boolean;
  isMobile: boolean;
  showText: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({
  isOpen,
  isMobile,
  showText,
  toggleSidebar,
}) => {
  return (
    <header className="hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 md:flex items-center justify-between px-4 z-30">
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <div 
            
          className={`${showText ?"h-10 w-10 text-xl rounded-md":"h-5 w-5 text-sm rounded-md" } bg-green-500 flex items-center justify-center text-white font-bold `}>
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
          <AiOutlineMenu className="text-xl " />
        )}
      </button>
    </header>
  );
};

export default SidebarHeader;