// src/components/HomePage.tsx
import React, { FC } from "react";
import PatientList from "./PatientList";

interface HomePageProps {
  searchTerm: string;
}

const HomePage: FC<HomePageProps> = ({ searchTerm }) => {
  return (
    <div>
      <div className="px-4 py-5 my-5 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl py-4">Welcome to MedChain</h1>
        <div className="col-lg-6 mx-auto">
          <p className="">
            We're revolutionizing healthcare by providing a secure, efficient platform for sharing patient data among medical professionals. 
            Focus on care while we handle the complexity of data management and security. 
            MedChain - transforming patient care through seamless collaboration.
          </p>
        </div>
      </div>
      <PatientList searchTerm={searchTerm} />
    </div>
  );
};

export default HomePage;
