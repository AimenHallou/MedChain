// src/components/PublishForm.tsx
import React, { FC, FormEvent, useState } from 'react';
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
  const [shareWith, setShareWith] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

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

  const handleShareWithChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShareWith(event.target.value);
  };

  const handleAddSharedUser = () => {
    setSharedUsers([...sharedUsers, shareWith]);
    setShareWith('');
  };

  const handleRemoveSharedUser = (username: string) => {
    setSharedUsers(sharedUsers.filter(user => user !== username));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const createdDate = new Date().toISOString();
    dispatch(addAsset({ ...form, owner: user.username, createdDate, sharedWith: sharedUsers, history: [`Asset created on ${createdDate}`] }));
    dispatch(resetForm());
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mt-5">      <div className="mb-4">
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

      <div className="mb-4">
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

      <div className="mb-4">
        <label className="block text-white font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="text"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-bold mb-2" htmlFor="content">
          Content
        </label>
        <input
          id="content"
          name="content"
          type="text"
          value={form.content}
          onChange={handleChange}
          className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
        />
      </div>

      <div className="mb-4 flex items-center">
        <label className="text-white font-bold mr-2" htmlFor="restricted">
          Restricted
        </label>
        <input
          id="restricted"
          name="restricted"
          type="checkbox"
          checked={form.restricted}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-blue-500"
        />
      </div>

      {form.restricted && (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Enter username to share with"
      value={shareWith}
      onChange={handleShareWithChange}
      className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
    />
    <button 
      type="button" 
      onClick={handleAddSharedUser} 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add User
    </button>
    <div>
      {sharedUsers.map((username, index) => (
        <div key={index}>
          <span>{username}</span>
          <button 
            type="button" 
            onClick={() => handleRemoveSharedUser(username)} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Remove User
          </button>
        </div>
      ))}
    </div>
  </div>
    )}
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Publish
        </button>
      </div>

    </form>
  );
};

export default PublishForm;
