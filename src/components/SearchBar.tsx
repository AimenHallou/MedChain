// src/components/SearchBar.tsx
import React, { FC, useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
        className="rounded-l px-4 py-2 text-black"  
      />
      <div className="bg-blue-700 px-4 py-2 rounded-r">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-6a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
