// src/pages/datasets/[id].tsx
import React, { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../app/hook";
import {
  fetchSingleDataset,
} from "../../redux/slices/datasetSlice";

const DatasetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const datasets = useSelector((state: RootState) => state.datasets);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleDataset(id as string));
    }
  }, [id, dispatch]);

  const datasetData = datasets.find(dataset => dataset.dataset_id === id);

  if (!datasetData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 mt-10 mx-4">
      <div className="w-full lg:w-[20rem] bg-gray-700 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold">Dataset Info</h2>
          <p>Dataset ID: {datasetData.dataset_id}</p>
          <p>Description: {datasetData.description}</p>
        </div>

        <div className="px-6 py-2 space-y-4">
          <div className="border-t border-gray-700">Dataset Actions</div>
          <div className="border-t border-gray-700">Another Section</div>
        </div>
      </div>
      
      <div className="w-full lg:w-[40rem] bg-gray-700 text-white rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <div className="px-6 py-4">
          Dataset Content
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;
