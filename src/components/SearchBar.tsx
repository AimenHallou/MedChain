// src/components/SearchBar.tsx
import React, { FC, useState } from "react";
import { BsSearch } from 'react-icons/Bs';

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
    <div className="flex items-stretch">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
        className="rounded-l px-4 text-black flex-grow py-2"  
      />
      <div className="bg-blue-700 px-4 py-2 rounded-r flex items-center">
      <BsSearch className="h-6 w-6"/>
      </div>
    </div>
  );
};

export default SearchBar;
