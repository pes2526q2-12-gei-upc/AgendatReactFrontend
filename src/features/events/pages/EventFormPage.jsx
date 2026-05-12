import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EventFormFields } from "@/features/events/components/EventFormFields.jsx";
import { eventsApi } from "@/features/events/api/eventsApi.js";
import {
  fromDateTimeInput,
  normalizeCategoryIds,
  normalizeNumber,
  toDateTimeInput,
} from "@/features/events/utils/events.js";
import { listFromResponse } from "@/shared/api/client.js";
import { LoadingState } from "@/shared/ui/LoadingState/LoadingState.jsx";
import { PageHeader } from "@/shared/ui/PageHeader/PageHeader.jsx";

const initialForm = {
  denomination: "",
  subtitle: "",
  description: "",
  url_activity: "",
  url_ticket: "",
  schedule: "",
  free: false,
  modality: "Presencial",
  address: "",
  email: "",
  locality: "",
  telephone_locality: "",
  latitude: "",
  longitude: "",
  start_date: "",
  end_date: "",
  category_ids: "",
  provincia_id: "",
  comarca_id: "",
  municipi_id: "",
};

function isInvalidEmail(value) {
  return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isInvalidUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return !["http:", "https:"].includes(url.protocol);
  } catch {
    return true;
  }
}

function validateForm(form) {
  const errors = {};

  if (!String(form.denomination ?? "").trim()) {
    errors.denomination = "Enter the event name.";
  }

  if (!form.start_date) {
    errors.start_date = "Choose the start date and time.";
  }

  if (!form.end_date) {
    errors.end_date = "Choose the end date and time.";
  }

  if (isInvalidEmail(form.email)) {
    errors.email = "Enter a valid contact email.";
  }

  if (isInvalidUrl(form.url_activity)) {
    errors.url_activity = "Enter a valid activity URL starting with http:// or https://.";
  }

  if (isInvalidUrl(form.url_ticket)) {
    errors.url_ticket = "Enter a valid ticket URL starting with http:// or https://.";
  }

  return errors;
}

function idsFromEvent(event) {
  if (Array.isArray(event.category_ids)) {
    return event.category_ids.join(",");
  }

  if (Array.isArray(event.categories)) {
    return event.categories.map((category) => category.id).join(",");
  }

  return "";
}

function formFromEvent(event) {
  return {
    ...initialForm,
    ...event,
    free: Boolean(event.free),
    latitude: event.latitude ?? "",
    longitude: event.longitude ?? "",
    provincia_id: event.provincia_id ?? "",
    comarca_id: event.comarca_id ?? "",
    municipi_id: event.municipi_id ?? "",
    start_date: toDateTimeInput(event.start_date),
    end_date: toDateTimeInput(event.end_date),
    category_ids: idsFromEvent(event),
  };
}

export function EventFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { code } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comarcas, setComarcas] = useState([]);
  const [municipis, setMunicipis] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadInitialData() {
      try {
        const [categoryPayload, provinciaPayload] = await Promise.all([
          eventsApi.categories(),
          eventsApi.provincias(),
        ]);

        if (isActive) {
          setCategories(listFromResponse(categoryPayload));
          setProvincias(listFromResponse(provinciaPayload));
        }
      } catch {
        if (isActive) {
          setCatalogError("Catalog lists could not be loaded. Try refreshing the page.");
        }
      }
    }

    loadInitialData();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let isActive = true;

    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await eventsApi.event(code);
        if (isActive) {
          setForm(formFromEvent(payload));
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEvent();
    return () => {
      isActive = false;
    };
  }, [code, isEdit]);

  useEffect(() => {
    if (!form.provincia_id || catalogError) {
      setComarcas([]);
      return undefined;
    }

    let isActive = true;
    eventsApi
      .comarcas(form.provincia_id)
      .then((payload) => {
        if (isActive) {
          setComarcas(listFromResponse(payload));
        }
      })
      .catch(() => {
        if (isActive) {
          setCatalogError("Catalog lists could not be loaded. Try refreshing the page.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [catalogError, form.provincia_id]);

  useEffect(() => {
    if (!form.provincia_id || !form.comarca_id || catalogError) {
      setMunicipis([]);
      return undefined;
    }

    let isActive = true;
    eventsApi
      .municipis(form.provincia_id, form.comarca_id)
      .then((payload) => {
        if (isActive) {
          setMunicipis(listFromResponse(payload));
        }
      })
      .catch(() => {
        if (isActive) {
          setCatalogError("Catalog lists could not be loaded. Try refreshing the page.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [catalogError, form.comarca_id, form.provincia_id]);

  const selectedCategoryIds = useMemo(
    () => normalizeCategoryIds(form.category_ids),
    [form.category_ids],
  );

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => {
      const nextForm = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "provincia_id") {
        nextForm.comarca_id = "";
        nextForm.municipi_id = "";
      }

      if (name === "comarca_id") {
        nextForm.municipi_id = "";
      }

      return nextForm;
    });
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleCategoryToggle = (categoryId) => {
    const id = Number(categoryId);
    const nextIds = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((selectedId) => selectedId !== id)
      : [...selectedCategoryIds, id];

    setForm((current) => ({ ...current, category_ids: nextIds.join(",") }));
  };

  const payloadFromForm = () => ({
    denomination: form.denomination,
    subtitle: form.subtitle,
    description: form.description,
    url_activity: form.url_activity,
    url_ticket: form.url_ticket,
    schedule: form.schedule,
    free: form.free,
    modality: form.modality,
    address: form.address,
    email: form.email,
    locality: form.locality,
    telephone_locality: form.telephone_locality,
    latitude: normalizeNumber(form.latitude),
    longitude: normalizeNumber(form.longitude),
    start_date: fromDateTimeInput(form.start_date),
    end_date: fromDateTimeInput(form.end_date),
    category_ids: normalizeCategoryIds(form.category_ids),
    provincia_id: normalizeNumber(form.provincia_id),
    comarca_id: normalizeNumber(form.comarca_id),
    municipi_id: normalizeNumber(form.municipi_id),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const nextFieldErrors = validateForm(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = payloadFromForm();
      const response = isEdit
        ? await eventsApi.updateEvent(code, payload)
        : await eventsApi.createEvent(payload);
      navigate(`/events/${response?.code ?? code}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState label="Loading event form" />;
  }

  return (
    <section className="page-stack">
      <PageHeader
        eyebrow={isEdit ? "Edit event" : "Create event"}
        title={isEdit ? "Update event" : "New event"}
        description="Fill the event details exactly as they should be reviewed and published."
        actions={
          <Link className="button button--secondary" to={isEdit ? `/events/${code}` : "/events"}>
            Cancel
          </Link>
        }
      />
      {form.publication_status === "published" ? (
        <p className="notice">
          Editing a published event sends it back to pending review after saving.
        </p>
      ) : null}
      {catalogError ? <p className="form-error">{catalogError}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <EventFormFields
        form={form}
        categories={categories}
        provincias={provincias}
        comarcas={comarcas}
        municipis={municipis}
        catalogError={catalogError}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        selectedCategoryIds={selectedCategoryIds}
        onChange={handleChange}
        onCategoryToggle={handleCategoryToggle}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
