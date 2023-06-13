// src/components/PublishForm.tsx
import React, { FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setField, resetForm } from '../redux/slices/formSlice';
import { addAsset } from '../redux/slices/assetSlice';
import { RootState } from '../redux/store';

const PublishForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useSelector((state: RootState) => state.form);
  const user = useSelector((state: RootState) => state.user);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setField({ field: event.target.name as keyof typeof form, value: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(addAsset({ ...form, owner: user.username }));
    dispatch(resetForm());
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        value={form.description}
        onChange={handleChange}
      />

      <label htmlFor="createdDate">Created Date</label>
      <input
        id="createdDate"
        name="createdDate"
        type="text"
        value={form.createdDate}
        onChange={handleChange}
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        name="price"
        type="text"
        value={form.price}
        onChange={handleChange}
      />

      <button type="submit">Publish</button>
    </form>
  );
};

export default PublishForm;
