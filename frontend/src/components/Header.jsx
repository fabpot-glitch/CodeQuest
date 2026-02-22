import { Bell } from "lucide-react";

const Header = ({ unreadCount, openNotifications }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">

      {/* 🔔 Notification Bell */}
      <button
        onClick={openNotifications}
        className="relative text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🏆 Rank Badge */}
      <div className="flex items-center gap-2 bg-yellow-900/40 text-yellow-400 px-4 py-1.5 rounded-full border border-yellow-500">
        🏆 <span className="text-sm font-semibold">Rank #-</span>
      </div>
    </div>
  );
};

export default Header;
