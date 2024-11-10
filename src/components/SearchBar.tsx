import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative flex-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="w-full rounded-full bg-white/10 px-6 py-3 pl-12 text-white placeholder-white/70 outline-none backdrop-blur-md transition-all focus:bg-white/20"
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
    </motion.form>
  );
};