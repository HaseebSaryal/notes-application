import { useEffect, useRef, useState } from "react";
import api from "../libs/axios";

const AutocompleteTextarea = ({ value, onChange, placeholder, rows = 6, className = "" }) => {
  const [suggestion, setSuggestion] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const currentText = value ?? "";
    let isActive = true;

    if (!currentText.trim()) {
      setSuggestion("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const { data } = await api.post("/autocomplete", { text: currentText });
        if (isActive) setSuggestion(data?.suggestion || "");
      } catch {
        if (isActive) setSuggestion("");
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [value]);

  const acceptSuggestion = () => {
    const input = textareaRef.current;
    if (!suggestion) return;

    if (!input) {
      onChange(`${value}${suggestion}`);
      setSuggestion("");
      return;
    }

    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const nextValue = `${value.slice(0, start)}${suggestion}${value.slice(end)}`;

    onChange(nextValue);
    setSuggestion("");

    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + suggestion.length;
      input.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab" && suggestion) {
      event.preventDefault();
      acceptSuggestion();
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>

      {/* Textarea — clean, no mirror div */}
      <textarea
        ref={textareaRef}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
      />

      {/* Desktop: ghost suggestion below textarea */}
      {suggestion && (
        <div className="hidden sm:flex items-center gap-2 mt-1 px-3 py-1.5 border border-gray-700 bg-gray-800 rounded-md">
          <span className="text-gray-500 text-sm truncate flex-1">{suggestion}</span>
          <span className="text-xs text-gray-600 shrink-0">Tab to accept</span>
        </div>
      )}

      {/* Mobile: suggestion bar */}
      {suggestion && (
        <div className="flex sm:hidden items-center justify-between gap-2 mt-1 px-3 py-2 bg-base-200 border border-base-300 rounded-md">
          <p className="text-sm text-base-content/50 truncate flex-1">
            {suggestion}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSuggestion("")}
              className="text-xs text-base-content/40 px-2 py-1"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={acceptSuggestion}
              className="text-xs bg-primary text-primary-content px-3 py-1 rounded"
            >
              Accept
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AutocompleteTextarea;