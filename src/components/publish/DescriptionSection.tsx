// src/components/publish/DescriptionSection.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDescription } from '../../redux/slices/formSlice';
import { RootState } from '../../redux/store';

const DescriptionSection: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.form);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDescription(event.target.value));
  };

  return (
    <div className="flex justify-center mb-4">
      <div className="w-1/2">
        <label className="block text-white font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
        />
      </div>
    </div>
  );
};

export default DescriptionSection;
