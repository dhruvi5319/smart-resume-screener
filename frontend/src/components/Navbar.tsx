import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  user: User;
}

const Navbar = ({ isAuthenticated, onLogout, user }: NavbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-indigo-100">
      <div className="px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="ScreenWise Logo" className="h-6 w-6" />
            <span className="text-indigo-700 font-extrabold text-2xl">ScreenWise</span>
          </Link>

          {/* Right side: User */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-700 focus:outline-none"
              >
                <UserRound className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Welcome, <strong>{user.name}</strong>
                  </div>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;