// src/components/PatientList.tsx
import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PatientCard from "./PatientCard";
import { RootState, AppDispatch } from "../redux/store";
import { fetchPatients } from "../redux/slices/patientSlice";
import Link from "next/link";
import SearchBar from "./SearchBar";
import PublisherFilter from "./PublisherFilter";

const PatientList: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients);
  const users = useSelector((state: RootState) => state.user.users);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const filterPatientsBasedOnCriteria = (filter: string) => {
    if (filter === "") {
      return patients;
    }

    return Array.isArray(patients)
      ? patients.filter((patient) => {
          const user = users.find((u) => u.address === patient.owner);
          const searchTermExistsInField = (field: string) => {
            switch (field) {
              case "address":
                return patient.owner.toLowerCase().includes(searchTerm.toLowerCase());
              case "name":
                return user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
              case "healthcareType":
                return user?.healthcareType.toLowerCase().includes(searchTerm.toLowerCase()) || false;
              case "organizationName":
                return user?.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) || false;
              default:
                return false;
            }
        };        

          return searchTermExistsInField(filter);
        })
      : [];
  };

  const filteredPatients = filterPatientsBasedOnCriteria(selectedFilters[0] || "");

  return (
    <div className="bg-gray-700 text-white rounded-lg p-4 shadow border-2 border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Patients</h2>
        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <PublisherFilter onFilterChange={handleFilterChange} />
          <Link href="/publish">
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Add Patient
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients && filteredPatients.map((patient, index) => (
          <PatientCard key={patient.patient_id || `fallback-${index}`} {...patient} />
        ))}
      </div>
    </div>
  );
};

export default PatientList;
