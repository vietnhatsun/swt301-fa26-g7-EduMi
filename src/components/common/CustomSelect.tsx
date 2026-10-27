"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | string)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  prefixLabel?: string;
  align?: "left" | "right";
  id?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  icon: Icon,
  disabled = false,
  prefixLabel,
  align = "left",
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options into CustomSelectOption array
  const normalizedOptions: CustomSelectOption[] = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        const currentIndex = normalizedOptions.findIndex(
          (opt) => opt.value === value
        );
        let nextIndex = currentIndex;
        if (e.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % normalizedOptions.length;
        } else {
          nextIndex =
            (currentIndex - 1 + normalizedOptions.length) %
            normalizedOptions.length;
        }
        if (normalizedOptions[nextIndex]) {
          onChange(normalizedOptions[nextIndex].value);
        }
      }
    },
    [disabled, isOpen, normalizedOptions, onChange, value]
  );

  const displayLabel = selectedOption
    ? selectedOption.label
    : placeholder;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
      id={id}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none outline-none ${
          isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/15 shadow-sm"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : ""} ${
          buttonClassName || "text-slate-800"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isOpen ? "text-emerald-600" : "text-slate-400"
              }`}
            />
          )}
          {prefixLabel && (
            <span className="text-slate-400 font-semibold shrink-0">
              {prefixLabel}
            </span>
          )}
          <span
            className={`truncate ${
              !selectedOption && placeholder
                ? "text-slate-400 font-normal"
                : "text-slate-800"
            }`}
          >
            {displayLabel}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 z-50 min-w-[180px] max-w-[280px] sm:max-w-xs rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          style={{ width: "max-content", minWidth: "100%" }}
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none text-left ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  } ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {OptIcon && (
                      <OptIcon
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? "text-emerald-600" : "text-slate-400"
                        }`}
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {opt.badge && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
