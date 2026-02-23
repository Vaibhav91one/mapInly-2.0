"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function matchesSearch<T extends object>(
  item: T,
  query: string,
  searchKeys: (keyof T)[]
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  return searchKeys.some((k) => {
    const val = (item as Record<string, unknown>)[k as string];
    if (val == null) return false;
    if (Array.isArray(val)) {
      return val.some((v) => String(v).toLowerCase().includes(q));
    }
    return String(val).toLowerCase().includes(q);
  });
}

interface SearchAutocompleteProps<T> {
  items: T[];
  searchKeys: (keyof T)[];
  value: string;
  onChange: (value: string) => void;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  ariaLabel?: string;
  emptyMessage?: string;
  getItemKey: (item: T) => string;
  className?: string;
  inputClassName?: string;
}

export function SearchAutocomplete<T extends object>({
  items,
  searchKeys,
  value,
  onChange,
  renderItem,
  onSelect,
  placeholder,
  ariaLabel,
  emptyMessage,
  getItemKey,
  className,
  inputClassName,
}: SearchAutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredItems = items.filter((item) => matchesSearch(item, value, searchKeys));
  const showDropdown = isOpen && value.trim().length > 0;

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      setIsOpen(false);
      setHighlightedIndex(0);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || filteredItems.length === 0) {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(filteredItems[highlightedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    },
    [showDropdown, filteredItems, highlightedIndex, handleSelect]
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [value, filteredItems.length]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="absolute left-6 top-1/2 size-14 -translate-y-1/2 text-white/60 md:size-10"
          aria-hidden
        />
        <Input
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-autocomplete-list"
          aria-activedescendant={
            showDropdown && filteredItems[highlightedIndex]
              ? `search-item-${getItemKey(filteredItems[highlightedIndex])}`
              : undefined
          }
          id="search-autocomplete-input"
          className={cn(
            "h-[80px] w-full rounded-none border-secondary pl-16 text-4xl md:pl-20 md:text-4xl font-regular leading-tight tracking-tight text-background placeholder:text-background/60 focus-visible:border-white/40 focus-visible:ring-white/20",
            inputClassName
          )}
        />
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            id="search-autocomplete-list"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            ref={listRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-auto rounded-none border border-secondary/50 bg-secondary py-1 shadow-lg"
          >
            {filteredItems.length === 0 ? (
              <li className="px-6 py-4 text-background/70" role="option">
                {emptyMessage}
              </li>
            ) : (
              filteredItems.map((item, i) => (
                <motion.li
                  key={getItemKey(item)}
                  id={`search-item-${getItemKey(item)}`}
                  role="option"
                  aria-selected={i === highlightedIndex}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "cursor-pointer px-6 py-4 text-background transition-colors",
                    i === highlightedIndex ? "bg-secondary/80" : "hover:bg-secondary/80"
                  )}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  {renderItem(item)}
                </motion.li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
