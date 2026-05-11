export function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  step,
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        onChange={onChange}
      />
    </label>
  );
}

export function TextAreaField({ label, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="field field--full">
      <span>{label}</span>
      <textarea
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

export function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} required={required} onChange={onChange}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.id ?? option.value} value={option.id ?? option.value}>
            {option.name ?? option.label ?? option.denomination}
          </option>
        ))}
      </select>
    </label>
  );
}
