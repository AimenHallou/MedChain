// src/pages/index.tsx
import React from "react";
import HomePage from "../components/homepage/HomePage";

interface IndexPageProps {
  searchTerm: string;
}

const IndexPage: React.FC<IndexPageProps> = ({ searchTerm }) => {
  return <HomePage searchTerm={searchTerm} />;
};

export default IndexPage;
