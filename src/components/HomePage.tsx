// src/components/HomePage.tsx
import React, { FC } from "react";
import PatientList from "./PatientList";

interface HomePageProps {
  searchTerm: string;
}

const HomePage: FC<HomePageProps> = ({ searchTerm }) => {
  return (
    <div>
      <PatientList searchTerm={searchTerm} />
    </div>
  );
};

export default HomePage;
