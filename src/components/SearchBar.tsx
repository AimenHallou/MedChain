// src/components/SearchBar.tsx
import React, { FC, useState } from 'react';

const SearchBar: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Searching for ${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
