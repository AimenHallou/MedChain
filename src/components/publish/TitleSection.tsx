// src/components/publish/TitleSection.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../redux/slices/formSlice';
import { RootState } from '../../redux/store';

const TitleSection: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.form);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  return (
    <div className="mb-4">
      <label className="block text-white font-bold mb-2" htmlFor="title">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
      />
    </div>
  );
};

export default TitleSection;
