import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EventDetailSummary } from "@/features/events/components/EventDetailSummary.jsx";
import { EventMetrics } from "@/features/events/components/EventMetrics.jsx";
import { eventsApi } from "@/features/events/api/eventsApi.js";
import { eventTitle } from "@/features/events/utils/events.js";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog/ConfirmDialog.jsx";
import { LoadingState } from "@/shared/ui/LoadingState/LoadingState.jsx";
import { PageHeader } from "@/shared/ui/PageHeader/PageHeader.jsx";

export function EventDetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await eventsApi.event(code);
        if (isActive) {
          setEvent(payload);
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
  }, [code]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await eventsApi.deleteEvent(code);
      navigate("/events", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingState label="Loading event" />;
  }

  if (!event) {
    return (
      <section className="page-stack">
        <PageHeader title="Event not found" description={error || "This event could not be loaded."} />
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Event detail"
        title={eventTitle(event)}
        description={event.subtitle || event.description || "No description"}
        actions={
          <>
            <Link className="button button--primary" to={`/events/${code}/edit`}>
              <Edit size={17} />
              Edit
            </Link>
            <button
              className="button button--danger"
              type="button"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 size={17} />
              Delete
            </button>
          </>
        }
      />
      {error ? <p className="form-error">{error}</p> : null}
      <EventDetailSummary event={event} />
      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Metrics</span>
          <h2>Performance</h2>
          <p>Audience activity, review scores, and daily engagement for this event.</p>
        </div>
        <EventMetrics code={code} />
      </section>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete event?"
        description="This permanently removes the event from your backoffice list. This action cannot be undone."
        confirmLabel="Delete event"
        isBusy={isDeleting}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
