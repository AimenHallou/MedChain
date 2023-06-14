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
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mt-5">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="text"
          value={form.price}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
          Content
        </label>
        <input
          id="content"
          name="content"
          type="text"
          value={form.content}
          onChange={handleChange}
          className="shadow appearance-noneborder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="restricted">
          Restricted
        </label>
        <input
          id="restricted"
          name="restricted"
          type="checkbox"
          checked={form.restricted}
          onChange={handleChange}
          className="shadow  border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Publish
        </button>
      </div>
    </form>
  );
};

export default PublishForm;
