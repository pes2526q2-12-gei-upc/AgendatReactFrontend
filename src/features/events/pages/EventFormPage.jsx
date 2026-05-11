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
          setCatalogError(
            "Catalog dropdowns could not be loaded. Enter numeric IDs manually.",
          );
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
          setCatalogError(
            "Catalog dropdowns could not be loaded. Enter numeric IDs manually.",
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [catalogError, form.provincia_id]);

  useEffect(() => {
    if (!form.comarca_id || catalogError) {
      setMunicipis([]);
      return undefined;
    }

    let isActive = true;
    eventsApi
      .municipis(form.comarca_id)
      .then((payload) => {
        if (isActive) {
          setMunicipis(listFromResponse(payload));
        }
      })
      .catch(() => {
        if (isActive) {
          setCatalogError(
            "Catalog dropdowns could not be loaded. Enter numeric IDs manually.",
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [catalogError, form.comarca_id]);

  const selectedCategoryIds = useMemo(
    () => normalizeCategoryIds(form.category_ids),
    [form.category_ids],
  );

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        isSubmitting={isSubmitting}
        selectedCategoryIds={selectedCategoryIds}
        onChange={handleChange}
        onCategoryToggle={handleCategoryToggle}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
