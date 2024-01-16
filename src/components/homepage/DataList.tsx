// src/components/homepage/DataList.tsx
import React, { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PatientCard from "../PatientCard";
import DatasetCard from "../DatasetCard";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchPatients } from "../../redux/slices/patientSlice";
import { fetchDatasets } from "../../redux/slices/datasetSlice";
import { FaDatabase, FaUser } from "react-icons/fa";

import Link from "next/link";
import SearchBar from "./SearchBar";
import PublisherFilter from "./PublisherFilter";

const PatientList: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients) || {};
  const datasets = useSelector((state: RootState) => state.datasets) || {};
  const users = useSelector((state: RootState) => state.user.users);
  const [view, setView] = useState<"patients" | "datasets">("patients");

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedFileFilters, setSelectedFileFilters] = useState<string[]>([]);

  useEffect(() => {
    if (view === "patients") {
      dispatch(fetchPatients());
    } else if (view === "datasets") {
      dispatch(fetchDatasets());
    }
  }, [dispatch, view]);

  const [searchTerm, setSearchTerm] = useState("");

  type ViewType = "patients" | "datasets";

  const viewMap: Record<
    ViewType,
    { label: string; nextView: ViewType; title: string }
  > = {
    patients: {
      label: "View Datasets",
      nextView: "datasets",
      title: "Patients",
    },
    datasets: {
      label: "View Patients",
      nextView: "patients",
      title: "Datasets",
    },
  };

  const currentViewConfig = viewMap[view];

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

  let displayedItems: Array<any> =
    view === "patients" ? filteredPatients : datasets;

  return (
    <div className="flex flex-col items-center bg-module-background text-white rounded-lg p-4 shadow border-2 border-module-accent">
      <div className="flex items-center w-full mb-4 space-x-4">
        <h2 className="text-lg font-bold">{currentViewConfig.title}</h2>
        <div onClick={() => setView(currentViewConfig.nextView)}>
          {view === "patients" ? (
            <FaDatabase
              size={18}
              className="cursor-pointer hover:text-gray-400 transition-colors duration-200"
            />
          ) : (
            <FaUser
              size={18}
              className="cursor-pointer hover:text-gray-400 transition-colors duration-200"
            />
          )}
        </div>
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
          <button
            className={`px-4 py-2 bg-blue-button text-white rounded-lg hover:bg-page-hover-button transition-colors duration-200 add-btn ${
              view === "datasets" ? "hidden" : ""
            }`}
          >
            Add Patient
          </button>
        </Link>
        <Link href="/publish-dataset">
          <button
            className={`px-4 py-2 bg-blue-button text-white rounded-lg hover:bg-page-hover-button transition-colors duration-200 add-btn ${
              view === "patients" ? "hidden" : ""
            }`}
          >
            Add Dataset
          </button>
        </Link>
      </div>

      {displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
          {displayedItems.map((item, index) =>
            view === "patients" ? (
              <PatientCard
                key={item.patient_id || `fallback-${index}`}
                {...item}
              />
            ) : (
              <DatasetCard
                key={item.dataset_id || `fallback-${index}`}
                {...item}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center mt-4">
          <h3 className="text-xl font-semibold text-main-text">
            No {view} to Display
          </h3>
          <p className="text-sub-text mt-2">
            Please add or search for a {view.slice(0, -1)} to view their
            details.
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientList;
