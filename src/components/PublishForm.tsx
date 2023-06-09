import React, { FC, useState, FormEvent } from 'react';
import { getOceanInstance } from '../ocean';

const PublishForm: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const ocean = await getOceanInstance();
    // ... use the `ocean` instance to interact with the Ocean Protocol

    alert(`Title: ${title}\nDescription: ${description}\nPrice: ${price}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        value={description}
        onChange={event => setDescription(event.target.value)}
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="text"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />

      <button type="submit">Publish</button>
    </form>
  );
}

export default PublishForm;
