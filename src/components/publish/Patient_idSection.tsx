// src/components/publish/TitleSection.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPatient_id } from '../../redux/slices/formSlice';
import { RootState } from '../../redux/store';

const Patient_idSection: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.form);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPatient_id(event.target.value));
  };

  return (
    <div className="flex justify-center mb-4">
      <div className="w-1/2">
        <label className="block text-white font-bold mb-2" htmlFor="patient_id">
        Patient ID
        </label>
        <input
          id="patient_id"
          name="patient_id"
          type="text"
          value={form.patient_id}
          onChange={handleChange}
          className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
        />
      </div>
    </div>
  );
};

export default Patient_idSection;
