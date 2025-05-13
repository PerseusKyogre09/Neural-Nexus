"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

export interface FilterOptions {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export default function SearchAndFilter({ onSearch, onFilterChange, categories }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'popular'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      category: '',
      minPrice: null,
      maxPrice: null,
      sortBy: 'popular'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-xl p-4">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for AI models..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none text-white"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
        >
          <span className="text-lg">🔧</span>
        </button>
      </form>

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Category filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price range filters */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
              min={0}
            />
          </div>

          {/* Sort options */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as 'price_asc' | 'price_desc' | 'newest' | 'popular')}
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
              aria-label="Sort models by"
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg mr-2"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 text-sm bg-pink-500 hover:bg-pink-600 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>

      {/* Active filters display */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.sortBy !== 'popular') && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          
          {filters.category && (
            <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded-full">
              {filters.category} ✕
            </span>
          )}
          
          {(filters.minPrice !== null || filters.maxPrice !== null) && (
            <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded-full">
              Price: {filters.minPrice !== null ? `$${filters.minPrice}` : '$0'} - {filters.maxPrice !== null ? `$${filters.maxPrice}` : '∞'} ✕
            </span>
          )}
          
          {filters.sortBy !== 'popular' && (
            <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded-full">
              Sort: {filters.sortBy.replace('_', ' ')} ✕
            </span>
          )}
        </div>
      )}
    </div>
  );
} 