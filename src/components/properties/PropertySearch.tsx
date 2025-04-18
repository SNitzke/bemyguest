
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";

interface PropertySearchProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch, onFilterClick }) => {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search properties..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <button
        onClick={onFilterClick}
        className="p-2 rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PropertySearch;
