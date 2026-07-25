import React from "react";

const FilterSection = ({ title, options, selected, onSelect }) => (
  <div className="mb-8">
    <h4 className="font-serif text-gray-900 font-medium mb-4">{title}</h4>
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
              selected === opt
                ? "bg-gray-900 border-gray-900"
                : "border-gray-300 group-hover:border-gray-500"
            }`}
          >
            {selected === opt && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={selected === opt}
            onChange={() => onSelect(opt)}
          />
          <span
            className={`text-sm ${
              selected === opt
                ? "text-gray-900 font-medium"
                : "text-gray-600 group-hover:text-gray-900"
            }`}
          >
            {opt}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default FilterSection;
