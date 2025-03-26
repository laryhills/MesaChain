import { FC } from "react";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { navItems } from "./navItemsData";


interface SidebarNavigationProps {
  showText: boolean;
}

const SidebarNavigation: FC<SidebarNavigationProps> = ({ showText }) => {
  const pathname = usePathname();

  return (
    <nav 
      className="mt-20 overflow-y-auto h-[calc(100%-124px)]"
      onClick={(e) => e.stopPropagation()}
    >
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
  );
};

export default SidebarNavigation;