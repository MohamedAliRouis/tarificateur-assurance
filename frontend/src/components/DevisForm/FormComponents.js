import React from "react";

// Reusable numeric input field
export const NumericInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  min = 0, 
  step = "0.01", 
  required = false,
  className = "col-md-6 mb-3" 
}) => (
  <div className={className}>
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type="number"
      className={`form-control ${error ? "is-invalid" : ""}`}
      id={name}
      name={name}
      value={value === null ? "" : value}
      onChange={onChange}
      step={step}
      min={min}
      required={required}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

// Reusable text input field
export const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  className = "col-md-6 mb-3",
  type = "text",
  rows
}) => {
  const InputComponent = rows ? "textarea" : "input";
  
  return (
    <div className={className}>
      <label htmlFor={name} className="form-label">
        {label} {required && "*"}
      </label>
      <InputComponent
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

// Reusable checkbox input
export const CheckboxInput = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = "col-md-6 mb-3"
}) => (
  <div className={className}>
    <div className="form-check mt-2">
      <input
        className="form-check-input"
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  </div>
);

// Reusable select input
export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  className = "col-md-6 mb-3"
}) => (
  <div className={className}>
    <label htmlFor={name} className="form-label">
      {label} {required && "*"}
    </label>
    <select
      className={`form-select ${error ? "is-invalid" : ""}`}
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
    >
      <option value="">Sélectionnez...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

// Reusable card component
export const FormCard = ({ title, children, className = "card mb-4", headerClass = "bg-primary" }) => (
  <div className={className}>
    <div className={`card-header ${headerClass} text-white`}>
      <h3>{title}</h3>
    </div>
    <div className="card-body">
      <div className="row">
        {children}
      </div>
    </div>
  </div>
);