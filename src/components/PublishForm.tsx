// src/components/PublishForm.tsx
import React, { FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle, setDescription, setPrice } from '../redux/slices/formSlice';
import { RootState } from '../redux/store';

const PublishForm: FC = () => {
  const dispatch = useDispatch();
  const { title, description, price } = useSelector((state: RootState) => state.form);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={event => dispatch(setTitle(event.target.value))}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        value={description}
        onChange={event => dispatch(setDescription(event.target.value))}
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="text"
        value={price}
        onChange={event => dispatch(setPrice(event.target.value))}
      />

      <button type="submit">Publish</button>
    </form>
  );
}

export default PublishForm;
