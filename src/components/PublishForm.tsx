// src/components/PublishForm.tsx
import React, { FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setTitle, setDescription, setOwner, setCreatedDate, setPrice, setContent, setRestricted, setSharedWith, resetForm } from '../redux/slices/formSlice';
import { addAsset } from '../redux/slices/assetSlice';
import { RootState } from '../redux/store';

const PublishForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useSelector((state: RootState) => state.form);
  const user = useSelector((state: RootState) => state.user);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const actionMap = {
      title: setTitle,
      description: setDescription,
      price: setPrice,
      content: setContent,
      restricted: setRestricted,
    };

    const action = actionMap[event.target.name];
    if (action) {
      const value = event.target.name === 'restricted' && event.target instanceof HTMLInputElement
        ? event.target.checked
        : event.target.value;
      dispatch(action(value));
    }
  };

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  const createdDate = new Date().toISOString();
  dispatch(addAsset({ ...form, owner: user.username, createdDate, sharedWith: [], history: [`Asset created on ${createdDate}`] }));
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

      <label htmlFor="price">Price</label>
      <input
        id="price"
        name="price"
        type="text"
        value={form.price}
        onChange={handleChange}
      />

      <label htmlFor="content">Content</label>
      <input
        id="content"
        name="content"
        type="text"
        value={form.content}
        onChange={handleChange}
      />

        <label htmlFor="restricted">
        Restricted
        <input
          id="restricted"
          name="restricted"
          type="checkbox"
          checked={form.restricted}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Publish</button>
    </form>
  );
};

export default PublishForm;
