import React from 'react';
import { Link } from 'react-router-dom';
import { usePathname } from '../utils/reactstuff';

const headerLink = (name, path) => {
    // Check if the current path is the same as the 
    var curr_path = usePathname().split("/")[1];
    const isActive = usePathname() === path;
    if (isActive) {
        return (
            <Link to={path} className="text-blue-700 dark:text-blue-300">
                {name}
            </Link>
        );
    }
    else {
        return (
            <Link to={path} className="text-gray-700 dark:text-gray-300">
                {name}
            </Link>
        );
    }
}

const AuthLink = (path) => {
    const isLoggedIn = document.cookie !== "";
    const action = isLoggedIn ? "Logout" : "Login";
    return (
        <Link to={path} className="text-gray-700 dark:text-gray-300 bg-blue-200 dark:bg-blue-800 rounded-lg px-3 py-1">
            {action}
        </Link>
    );
}

const Links = [
    { name: "Home", path: "/home" },
    { name: "Profile", path: "/profile" },
    { name: "Search", path: "/search" }
];


const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-5 bg-gray-100 dark:bg-gray-800 min-w-full sticky top-0">
            <Link to="/about" className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                Library
            </Link>
            <div className="flex items-center space-x-5">
                {Links.map((link, index) => (
                    <div key={index}>
                        {headerLink(link.name, link.path)}
                    </div>
                ))}
            </div>
            <div>
                {AuthLink("/")}
            </div>
        </nav>
    );
}

export default Navbar;