import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <p className="text-sm sm:text-base font-medium">
          &copy; {new Date().getFullYear()} Bug Tracker. All rights reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex space-x-4 text-xl">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition hover:scale-110"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition hover:scale-110"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition hover:scale-110"
          >
            <FaTwitter />
          </a>
        </div>

        <p className="text-xs text-gray-500">Built with ❤️ by YourName</p>
      </div>
    </footer>
  );
}

export default Footer;
