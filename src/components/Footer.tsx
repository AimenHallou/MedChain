// src/components/Footer.tsx
import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-blue-900 text-white">
      <a href="/">
        <img src="/images/logo.png" alt="Logo" className="h-16 mr-3" />
      </a>
      <nav className="flex items-center justify-center gap-4">
        <a href="/marketplace" className="text-white hover:underline">
          Marketplace
        </a>
        <a href="/about" className="text-white hover:underline">
          About
        </a>
        <a href="/docs" className="text-white hover:underline">
          Docs
        </a>
      </nav>
      <p className="text-sm">© 2023 MedChain. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
