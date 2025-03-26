import { FC } from "react";

interface SidebarUserProfileProps {
  showText: boolean;
}

const SidebarUserProfile: FC<SidebarUserProfileProps> = ({ showText }) => {
  return (
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
  );
};

export default SidebarUserProfile;