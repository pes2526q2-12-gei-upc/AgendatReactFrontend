import { Save } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/shared/ui/FormControls/FormControls.jsx";

export function EventFormFields({
  form,
  categories,
  provincias,
  comarcas,
  municipis,
  catalogError,
  isSubmitting,
  selectedCategoryIds,
  onChange,
  onCategoryToggle,
  onSubmit,
}) {
  return (
    <form className="panel form-grid event-form" onSubmit={onSubmit}>
      <TextField
        label="Event name"
        name="denomination"
        value={form.denomination}
        required
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
        onChange={onChange}
      />
      <TextField
        label="Ticket URL"
        name="url_ticket"
        type="url"
        value={form.url_ticket}
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
        onChange={onChange}
      />
      <TextField
        label="End date"
        name="end_date"
        type="datetime-local"
        value={form.end_date}
        required
        onChange={onChange}
      />
      {catalogError ? (
        <>
          <TextField
            label="Category IDs"
            name="category_ids"
            value={form.category_ids}
            placeholder="1,2"
            onChange={onChange}
          />
          <TextField
            label="Provincia ID"
            name="provincia_id"
            type="number"
            value={form.provincia_id}
            onChange={onChange}
          />
          <TextField
            label="Comarca ID"
            name="comarca_id"
            type="number"
            value={form.comarca_id}
            onChange={onChange}
          />
          <TextField
            label="Municipi ID"
            name="municipi_id"
            type="number"
            value={form.municipi_id}
            onChange={onChange}
          />
        </>
      ) : (
        <>
          <fieldset className="field field--full checkbox-group">
            <legend>Categories</legend>
            {categories.length ? (
              categories.map((category) => (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(Number(category.id))}
                    onChange={() => onCategoryToggle(category.id)}
                  />
                  <span>{category.name ?? category.denomination ?? `Category ${category.id}`}</span>
                </label>
              ))
            ) : (
              <span>No categories available.</span>
            )}
          </fieldset>
          <SelectField
            label="Provincia"
            name="provincia_id"
            value={form.provincia_id}
            options={provincias}
            onChange={onChange}
          />
          <SelectField
            label="Comarca"
            name="comarca_id"
            value={form.comarca_id}
            options={comarcas}
            onChange={onChange}
          />
          <SelectField
            label="Municipi"
            name="municipi_id"
            value={form.municipi_id}
            options={municipis}
            onChange={onChange}
          />
        </>
      )}
      <div className="form-actions field--full">
        <button className="button button--primary" disabled={isSubmitting}>
          <Save size={17} />
          {isSubmitting ? "Saving..." : "Save event"}
        </button>
      </div>
    </form>
  );
}
