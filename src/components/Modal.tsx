// src/components/Modal.tsx
import React, { FC } from "react";

interface ModalProps {
  isShowing: boolean;
  hide: () => void;
  children?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isShowing, hide, children }) => {
    if (!isShowing) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500">
        <div className="bg-black opacity-60 absolute inset-0"></div>
        <div className="bg-blue-500 rounded-lg px-8 py-6 w-11/12 max-w-lg z-10 transition-transform transform duration-500">
          <button
            onClick={hide}
            className="absolute top-4 right-4 p-1 transition duration-300 transform hover:scale-105 hover:bg-blue-400 rounded focus:outline-none"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };  

export default Modal;
