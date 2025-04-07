import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center py-6 px-4 text-sm text-gray-500 border-t mt-12">
      <p>© 2025 Jurnal Bumil. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:underline">Ketentuan</a>
        <a href="#" className="hover:underline">Privasi</a>
        <a href="#" className="hover:underline">Cookies</a>
      </div>
    </footer>
  );
};

export default Footer;
