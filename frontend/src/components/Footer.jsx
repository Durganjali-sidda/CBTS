import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; // Social media icons

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8 relative">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-semibold">&copy; 2025 Bug Tracker. All rights reserved.</p>
        
        {/* Social media links with hover effects */}
        <div className="flex space-x-6 text-2xl">
          <a
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110"
          >
            <FaTwitter />
          </a>
        </div>

        {/* Additional links if necessary */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Designed with ❤️ in 2025</p>
        </div>
      </div>

      {/* Animated footer slide-up effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 animate-pulse"></div> {/* Optional animated effect */}
    </footer>
  );
}

export default Footer;
