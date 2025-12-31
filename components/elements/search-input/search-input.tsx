'use client';

import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void | Promise<void>;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'タイトルで検索...',
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const isComposingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!isComposingRef.current) {
      onChange(newValue);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    onChange(e.currentTarget.value);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative flex items-center">
      <Search
        data-testid="search-icon"
        className="absolute left-3 h-4 w-4 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-600 bg-gray-800 py-2 pl-10 pr-10 text-sm text-gray-100 placeholder-gray-400 focus:border-terminal-green focus:outline-none focus:ring-1 focus:ring-terminal-green"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-200"
          aria-label="クリア"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
