import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-green-400 text-xl font-bold mb-4">ExploreNepal</h3>
          <p className="text-sm">
            Discover the most beautiful and peaceful places of Nepal with us.
            We provide unforgettable travel experiences, cultural tours, and adventure treks.
          </p>
        </div>

        {/* Quick Links */}
     
     
        {/* Contact / Social */}
        <div>
          <h3 className="text-green-400 text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-sm">Email: pokhreldarshan00@gmail.com</p>
          <p className="text-sm mb-4">Phone: +977-9848714549</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-white transition" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-white transition" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-white transition" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ExploreNepal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
