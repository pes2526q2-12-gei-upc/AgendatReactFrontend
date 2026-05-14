import { Save } from "lucide-react";
import PropTypes from "prop-types";
import {
  SearchableMultiSelectField,
  SearchableSelectField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/shared/ui/FormControls/FormControls.jsx";

export function EventFormFields({
  form,
  categories,
  provincias,
  comarcas,
  municipis,
  catalogError,
  fieldErrors = {},
  isSubmitting,
  selectedCategoryIds,
  onChange,
  onCategoryToggle,
  onSubmit,
}) {
  return (
    <form className="panel form-grid event-form" noValidate onSubmit={onSubmit}>
      <TextField
        label="Event name"
        name="denomination"
        value={form.denomination}
        required
        error={fieldErrors.denomination}
        onChange={onChange}
      />
      <TextField label="Subtitle" name="subtitle" value={form.subtitle} onChange={onChange} />
      <TextAreaField
        label="Description"
        name="description"
        value={form.description}
        onChange={onChange}
      />
      <TextField
        label="Activity URL"
        name="url_activity"
        type="url"
        value={form.url_activity}
        error={fieldErrors.url_activity}
        onChange={onChange}
      />
      <TextField
        label="Ticket URL"
        name="url_ticket"
        type="url"
        value={form.url_ticket}
        error={fieldErrors.url_ticket}
        onChange={onChange}
      />
      <TextField label="Schedule" name="schedule" value={form.schedule} onChange={onChange} />
      <SelectField
        label="Modality"
        name="modality"
        value={form.modality}
        onChange={onChange}
        options={[
          { value: "Presencial", label: "Presencial" },
          { value: "Online", label: "Online" },
          { value: "Hibrid", label: "Hybrid" },
        ]}
      />
      <label className="toggle-field">
        <input name="free" type="checkbox" checked={form.free} onChange={onChange} />
        <span>Free event</span>
      </label>
      <TextField label="Address" name="address" value={form.address} onChange={onChange} />
      <TextField label="Locality" name="locality" value={form.locality} onChange={onChange} />
      <TextField
        label="Contact email"
        name="email"
        type="email"
        value={form.email}
        error={fieldErrors.email}
        onChange={onChange}
      />
      <TextField
        label="Contact phone"
        name="telephone_locality"
        value={form.telephone_locality}
        onChange={onChange}
      />
      <TextField
        label="Latitude"
        name="latitude"
        type="number"
        step="any"
        value={form.latitude}
        onChange={onChange}
      />
      <TextField
        label="Longitude"
        name="longitude"
        type="number"
        step="any"
        value={form.longitude}
        onChange={onChange}
      />
      <TextField
        label="Start date"
        name="start_date"
        type="datetime-local"
        value={form.start_date}
        required
        error={fieldErrors.start_date}
        onChange={onChange}
      />
      <TextField
        label="End date"
        name="end_date"
        type="datetime-local"
        value={form.end_date}
        required
        error={fieldErrors.end_date}
        onChange={onChange}
      />
      <SearchableMultiSelectField
        label="Categories"
        values={selectedCategoryIds}
        options={categories}
        disabled={Boolean(catalogError)}
        emptyLabel="No categories available."
        searchPlaceholder="Search categories..."
        fallbackPrefix="Category"
        onToggle={onCategoryToggle}
      />
      <SearchableSelectField
        label="Provincia"
        name="provincia_id"
        value={form.provincia_id}
        options={provincias}
        disabled={Boolean(catalogError)}
        emptyLabel="No provincies available."
        searchPlaceholder="Search provincies..."
        fallbackPrefix="Provincia"
        onChange={onChange}
      />
      <SearchableSelectField
        label="Comarca"
        name="comarca_id"
        value={form.comarca_id}
        options={comarcas}
        disabled={Boolean(catalogError) || !form.provincia_id}
        emptyLabel="No comarques available."
        placeholder={form.provincia_id ? "Select..." : "Select a provincia first"}
        searchPlaceholder="Search comarques..."
        fallbackPrefix="Comarca"
        onChange={onChange}
      />
      <SearchableSelectField
        label="Municipi"
        name="municipi_id"
        value={form.municipi_id}
        options={municipis}
        disabled={Boolean(catalogError) || !form.provincia_id || !form.comarca_id}
        emptyLabel="No municipis available."
        placeholder={form.comarca_id ? "Select..." : "Select a comarca first"}
        searchPlaceholder="Search municipis..."
        fallbackPrefix="Municipi"
        onChange={onChange}
      />
      <div className="form-actions field--full">
        <button className="button button--primary" disabled={isSubmitting}>
          <Save size={17} />
          {isSubmitting ? "Saving..." : "Save event"}
        </button>
      </div>
    </form>
  );
}

const fieldValueType = PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]);

const formShape = PropTypes.shape({
  denomination: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  url_activity: PropTypes.string,
  url_ticket: PropTypes.string,
  schedule: PropTypes.string,
  modality: PropTypes.string,
  free: PropTypes.bool,
  address: PropTypes.string,
  locality: PropTypes.string,
  email: PropTypes.string,
  telephone_locality: PropTypes.string,
  latitude: fieldValueType,
  longitude: fieldValueType,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  provincia_id: fieldValueType,
  comarca_id: fieldValueType,
  municipi_id: fieldValueType,
});

const catalogOptionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  label: PropTypes.string,
  denomination: PropTypes.string,
  title: PropTypes.string,
  nom: PropTypes.string,
});

EventFormFields.propTypes = {
  form: formShape.isRequired,
  categories: PropTypes.arrayOf(catalogOptionShape).isRequired,
  provincias: PropTypes.arrayOf(catalogOptionShape).isRequired,
  comarcas: PropTypes.arrayOf(catalogOptionShape).isRequired,
  municipis: PropTypes.arrayOf(catalogOptionShape).isRequired,
  catalogError: PropTypes.string,
  fieldErrors: PropTypes.objectOf(PropTypes.string),
  isSubmitting: PropTypes.bool.isRequired,
  selectedCategoryIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onCategoryToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
