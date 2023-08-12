// src/components/PublisherFilter.tsx
import React, { FC, useState } from "react";

interface PublisherFilterProps {
  onFilterChange: (filters: string[]) => void;
}

const PublisherFilter: FC<PublisherFilterProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = event.target.value;
    setSelectedFilter(filter);
    onFilterChange([filter]);
  };

  const filterOptions = {
    "": "All Patients",
    "address": "Address",
    "name": "Name",
    "healthcareType": "Healthcare Type",
    "organizationName": "Organization Name",
  };

  return (
    <select
      className="bg-gray-800 rounded-lg text-white px-4 py-2"
      value={selectedFilter}
      onChange={handleFilterChange}
    >
      {Object.entries(filterOptions).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default PublisherFilter;
