// src/components/Footer.tsx
import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-end px-4 py-2 bg-blue-900 text-white">
      <p className="text-sm">© 2023 MedChain. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
