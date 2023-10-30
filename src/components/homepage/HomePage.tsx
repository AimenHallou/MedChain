// src/components/homepage/HomePage.tsx
import React, { FC } from "react";
import PatientList from "./DataList";
import PatientSummary from "./PatientSummary";
import RecentPatientData from "./RecentPatientData";
import Modal from "../Modal";
import { useModal, useAppDispatch } from '../../app/hook';

interface HomePageProps {
  searchTerm: string;
}

const HomePage: FC<HomePageProps> = ({ searchTerm }) => {
  const { isShowing, toggle } = useModal();

  return (
    <div className="bg-gradient-animate animate-gradient-shift bg-200% text-white min-h-screen py-8 px-6">
      <Modal isShowing={isShowing} hide={toggle}>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl py-1 text-white">Welcome to MedChain</h1>
          <p className="text-sm font-semibold text-gray-400">
            Welcome to MedChain: A secure platform for patient data collaboration.
          </p>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6 mt-8">
        <div className="col-span-2">
          <PatientSummary />
          <RecentPatientData />
        </div>
        <div className="col-span-8">
          <PatientList />
          <button onClick={toggle}>Toggle Modal</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
