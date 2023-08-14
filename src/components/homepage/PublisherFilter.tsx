// src/components/homepage/PublisherFilter.tsx
import React, { FC, useState } from "react";

interface PublisherFilterProps {
  onFilterChange: (filters: string[]) => void;
  filterType: "patient" | "file";
}

const PublisherFilter: FC<PublisherFilterProps> = ({ onFilterChange, filterType }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = event.target.value;
    setSelectedFilter(filter);
    onFilterChange([filter]);
  };

  const patientFilterOptions = {
    "": "All Patients",
    "address": "Address",
    "name": "Name",
    "healthcareType": "Healthcare Type",
    "organizationName": "Organization Name",
  };

  const fileFilterOptions = {
    "": "All File Types",
    "Lab results": "Lab Results",
    "Medical images": "Medical Images",
    "Medication history": "Medication History",
    "Clinician notes": "Clinician Notes"
  };

  const filterOptions = filterType === "patient" ? patientFilterOptions : fileFilterOptions;

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
