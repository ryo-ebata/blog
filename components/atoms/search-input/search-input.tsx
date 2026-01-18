'use client';

import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SearchInputProps {
  onChange: (value: string) => void | Promise<void>;
  placeholder?: string;
  value: string;
}

const handleCompositionStart = (isComposingRef: React.RefObject<boolean | null>) => () => {
  if (isComposingRef.current !== null) {
    (isComposingRef as React.MutableRefObject<boolean>).current = true;
  }
};

const createHandleCompositionEnd =
  (
    isComposingRef: React.RefObject<boolean | null>,
    onChange: (value: string) => void | Promise<void>
  ) =>
  (event: React.CompositionEvent<HTMLInputElement>) => {
    if (isComposingRef.current !== null) {
      (isComposingRef as React.MutableRefObject<boolean>).current = false;
    }
    onChange(event.currentTarget.value);
  };

export const SearchInput = ({
  onChange,
  placeholder = 'タイトルで検索...',
  value,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const isComposingRef = useRef(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (!isComposingRef.current) {
      onChange(newValue);
    }
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
        onCompositionStart={handleCompositionStart(isComposingRef)}
        onCompositionEnd={createHandleCompositionEnd(isComposingRef, onChange)}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
};
