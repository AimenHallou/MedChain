// src/components/homepage/PatientList.tsx
import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PatientCard from "../PatientCard";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchPatients } from "../../redux/slices/patientSlice";
import Link from "next/link";
import SearchBar from "./SearchBar";
import PublisherFilter from "./PublisherFilter";

const PatientList: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients);
  const users = useSelector((state: RootState) => state.user.users);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedFileFilters, setSelectedFileFilters] = useState<string[]>([]);

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

  const handleFileFilterChange = (filters: string[]) => {
    setSelectedFileFilters(filters);
  };

  const filterPatientsBasedOnCriteria = (filter: string) => {
    if (searchTerm === "") {
      return patients;
    }

    return patients.filter((patient) => {
      const user = users.find((u) => u.address === patient.owner);

      const stringContainsSearchTerm = (str: string | undefined) => {
        return str?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      };

      switch (filter) {
        case "address":
          return stringContainsSearchTerm(patient.owner);
        case "name":
          return stringContainsSearchTerm(user?.name);
        case "healthcareType":
          return stringContainsSearchTerm(user?.healthcareType);
        case "organizationName":
          return stringContainsSearchTerm(user?.organizationName);
        default:
          return false;
      }
    });
  };

  const filterPatientsByFileTypes = (patient: any, fileType: string) => {
    if (fileType === "") return true;

    let patientContent;
    try {
      patientContent = JSON.parse(patient.content);
    } catch (error) {
      console.error("Error parsing patient content:", error);
      return false;
    }

    if (Array.isArray(patientContent)) {
      const doesMatch = patientContent.some((file: any) => {
        return file.dataType === fileType;
      });
      return doesMatch;
    }
    return false;
  };

  const filteredPatients = patients.filter((patient) => {
    const patientCriteria = selectedFilters[0] || "";
    const fileCriteria = selectedFileFilters[0] || "";
    const isPatientCriteriaMet =
      filterPatientsBasedOnCriteria(patientCriteria).includes(patient);
    const isFileCriteriaMet = filterPatientsByFileTypes(patient, fileCriteria);
    return isPatientCriteriaMet && isFileCriteriaMet;
  });

  return (
    <div className="bg-gray-700 text-white rounded-lg p-4 shadow border-2 border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Patients</h2>
        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <PublisherFilter
            onFilterChange={handleFilterChange}
            filterType="patient"
          />
          <PublisherFilter
            onFilterChange={handleFileFilterChange}
            filterType="file"
          />
          <Link href="/publish">
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Add Patient
            </button>
          </Link>
        </div>
      </div>
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient, index) => (
            <PatientCard
              key={patient.patient_id || `fallback-${index}`}
              {...patient}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <h3 className="text-xl font-semibold">No Patients to Display</h3>
          <p className="text-gray-400 mt-2">
            Please add or search for a patient to view their details.
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientList;
