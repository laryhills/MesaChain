import { FC } from "react";
import Link from "next/link";
import { IconType } from "react-icons";

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

export default NavItem;