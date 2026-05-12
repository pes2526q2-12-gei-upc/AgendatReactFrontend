import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

function optionValue(option) {
  return String(option.id ?? option.value ?? "");
}

export function optionLabel(option, fallbackPrefix = "Option") {
  return (
    option.name ??
    option.label ??
    option.denomination ??
    option.title ??
    option.nom ??
    `${fallbackPrefix} ${option.id ?? option.value ?? ""}`.trim()
  );
}

function createChangeEvent(name, value) {
  return {
    target: {
      name,
      value,
    },
  };
}

export function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  minLength,
  maxLength,
  step,
  autoComplete,
  inputMode,
  error,
}) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-label="required">
            *
          </span>
        ) : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        min={min}
        minLength={minLength}
        maxLength={maxLength}
        step={step}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={onChange}
      />
      {error ? (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
}) {
  const errorId = `${name}-error`;

  return (
    <label className="field field--full">
      <span className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-label="required">
            *
          </span>
        ) : null}
      </span>
      <textarea
        name={name}
        value={value}
        rows={rows}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error ? (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField({ label, name, value, onChange, options, required = false, error }) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-label="required">
            *
          </span>
        ) : null}
      </span>
      <select
        name={name}
        value={value}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.id ?? option.value} value={option.id ?? option.value}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
      {error ? (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function SearchableSelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyLabel = "No options found.",
  fallbackPrefix,
  disabled = false,
}) {
  const errorId = `${name}-error`;
  const listboxId = useId();
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => optionValue(option) === String(value));
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      String(optionLabel(option, fallbackPrefix)).toLowerCase().includes(normalizedQuery),
    );
  }, [fallbackPrefix, options, query]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (nextValue) => {
    onChange(createChangeEvent(name, nextValue));
    setIsOpen(false);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onChange(createChangeEvent(name, ""));
  };

  return (
    <label className="field searchable-select" ref={containerRef}>
      <span className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-label="required">
            *
          </span>
        ) : null}
      </span>
      <span
        className="searchable-select__control"
        data-open={isOpen}
        data-disabled={disabled}
        data-invalid={Boolean(error)}
        data-has-value={Boolean(value)}
      >
        <button
          type="button"
          className="searchable-select__button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{selectedOption ? optionLabel(selectedOption, fallbackPrefix) : placeholder}</span>
          <ChevronDown size={17} aria-hidden="true" />
        </button>
        {value ? (
          <button
            type="button"
            className="searchable-select__clear"
            disabled={disabled}
            aria-label={`Clear ${label}`}
            onClick={handleClear}
          >
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
        {isOpen ? (
          <span className="searchable-select__popover">
            <span className="searchable-select__search">
              <Search size={16} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
            <span className="searchable-select__options" id={listboxId} role="listbox">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const nextValue = optionValue(option);
                  const isSelected = nextValue === String(value);

                  return (
                    <button
                      type="button"
                      key={nextValue}
                      role="option"
                      aria-selected={isSelected}
                      className="searchable-select__option"
                      onClick={() => handleSelect(nextValue)}
                    >
                      <span>{optionLabel(option, fallbackPrefix)}</span>
                      {isSelected ? <Check size={16} aria-hidden="true" /> : null}
                    </button>
                  );
                })
              ) : (
                <span className="searchable-select__empty">{emptyLabel}</span>
              )}
            </span>
          </span>
        ) : null}
      </span>
      {error ? (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function SearchableMultiSelectField({
  label,
  values,
  options,
  onToggle,
  emptyLabel = "No options found.",
  searchPlaceholder = "Search...",
  fallbackPrefix,
  disabled = false,
}) {
  const listboxId = useId();
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedValues = values.map((selectedValue) => String(selectedValue));
  const selectedOptions = options.filter((option) => normalizedValues.includes(optionValue(option)));
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      String(optionLabel(option, fallbackPrefix)).toLowerCase().includes(normalizedQuery),
    );
  }, [fallbackPrefix, options, query]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <fieldset className="field field--full searchable-select searchable-select--multi" ref={containerRef}>
      <legend>{label}</legend>
      <span
        className="searchable-select__control"
        data-open={isOpen}
        data-disabled={disabled}
      >
        <button
          type="button"
          className="searchable-select__button searchable-select__button--multi"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>
            {selectedOptions.length
              ? `${selectedOptions.length} selected`
              : "Select categories"}
          </span>
          <ChevronDown size={17} aria-hidden="true" />
        </button>
        {isOpen ? (
          <span className="searchable-select__popover">
            <span className="searchable-select__search">
              <Search size={16} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
            <span
              className="searchable-select__options"
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const nextValue = optionValue(option);
                  const isSelected = normalizedValues.includes(nextValue);

                  return (
                    <button
                      type="button"
                      key={nextValue}
                      role="option"
                      aria-selected={isSelected}
                      className="searchable-select__option"
                      onClick={() => onToggle(nextValue)}
                    >
                      <span>{optionLabel(option, fallbackPrefix)}</span>
                      {isSelected ? <Check size={16} aria-hidden="true" /> : null}
                    </button>
                  );
                })
              ) : (
                <span className="searchable-select__empty">{emptyLabel}</span>
              )}
            </span>
          </span>
        ) : null}
      </span>
      {selectedOptions.length ? (
        <span className="searchable-select__chips">
          {selectedOptions.map((option) => (
            <button
              type="button"
              key={optionValue(option)}
              className="searchable-select__chip"
              disabled={disabled}
              onClick={() => onToggle(optionValue(option))}
            >
              <span>{optionLabel(option, fallbackPrefix)}</span>
              <X size={14} aria-hidden="true" />
            </button>
          ))}
        </span>
      ) : (
        <span className="searchable-select__hint">No categories selected.</span>
      )}
    </fieldset>
  );
}
