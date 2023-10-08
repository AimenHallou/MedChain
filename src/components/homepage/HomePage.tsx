// src/components/homepage/HomePage.tsx
import React, { FC } from "react";
import PatientList from "./PatientList";
import PatientSummary from "./PatientSummary";
import RecentPatientData from "./RecentPatientData";

interface HomePageProps {
  searchTerm: string;
}

const HomePage: FC<HomePageProps> = ({ searchTerm }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl py-2 text-white">Welcome to MedChain</h1>
        <p className="text-sm">
          We're revolutionizing healthcare by providing a secure, efficient
          platform for sharing patient data among medical professionals. Focus
          on care while we handle the complexity of data management and
          security. MedChain - transforming patient care through seamless
          collaboration.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-9 gap-6 mt-8">
        <div className="col-span-2">
          <PatientSummary />
          <RecentPatientData />
        </div>
        <div className="col-span-7">
          <PatientList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
