import React, { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { Binary, Search, Image } from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-10 p-4 border-b border-gray-200 backdrop-blur-md bg-white/30">
        <div className="container flex items-center justify-between mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">ImageFinder</span>
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Search className="w-4 h-4 mr-1" />
                Search
              </Link>
            </li>
            <li>
              <Link
                to="/repl"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Binary className="w-4 h-4 mr-1" />
                REPL
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container flex-grow px-8 py-4 mx-auto">
        {children || <Outlet />}
      </main>
      <footer className="px-12 py-4 text-gray-400 bg-gray-800">
        <p>&copy; 2024 Jacob Keisling. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
