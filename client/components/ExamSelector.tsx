import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface ExamSelectorItem {
  key: string;
  name: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface ExamSelectorProps {
  label?: string;
  selectedKey: string;
  items: ExamSelectorItem[];
  onSelect: (key: string) => void;
  className?: string;
}

export default function ExamSelector({
  label = "Choose Exam Category",
  selectedKey,
  items,
  onSelect,
  className = "",
}: ExamSelectorProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    items.findIndex((item) => item.key === selectedKey),
    0
  );
  const selectedItem = items[selectedIndex] ?? items[0];

  useEffect(() => {
    setHighlightedIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const moveHighlight = (direction: 1 | -1) => {
    setHighlightedIndex((prev) => {
      if (items.length === 0) return 0;
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  };

  const onButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      moveHighlight(-1);
    } else if (event.key === "Escape") {
      setOpen(false);
      buttonRef.current?.blur();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (items[highlightedIndex]) {
        onSelect(items[highlightedIndex].key);
        setOpen(false);
      }
    }
  };

  return (
    <div ref={rootRef} className={`max-w-xl ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-700 to-amber-600" />
        <h2 className="text-2xl font-bold text-foreground">{label}</h2>
      </div>

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={onButtonKeyDown}
          className="w-full flex items-center justify-between gap-3 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/20 bg-card/70 hover:bg-card px-4 py-3.5 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            {selectedItem?.icon ? (
              <div className="p-2.5 rounded-lg shrink-0 bg-gradient-to-br from-emerald-700/25 to-amber-700/20">
                {selectedItem.icon}
              </div>
            ) : null}
            <div className="text-left min-w-0">
              <p className="text-xs text-muted-foreground">Selected exam</p>
              <p className="font-semibold text-foreground truncate">
                {selectedItem?.name}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute z-40 mt-2 w-full rounded-2xl border border-emerald-900/15 dark:border-emerald-800/25 bg-card/95 backdrop-blur shadow-xl max-h-72 overflow-y-auto p-2"
            >
              {items.map((item, idx) => {
                const isSelected = item.key === selectedKey;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={item.key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => {
                      onSelect(item.key);
                      setOpen(false);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors flex items-center gap-3 ${
                      isSelected
                        ? "bg-emerald-900/20 text-foreground border border-emerald-700/30"
                        : isHighlighted
                        ? "bg-muted/60 text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {item.icon ? (
                      <span className="shrink-0 opacity-90">{item.icon}</span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">
                        {item.name}
                      </span>
                      {item.subtitle ? (
                        <span className="block text-xs opacity-75 truncate">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
