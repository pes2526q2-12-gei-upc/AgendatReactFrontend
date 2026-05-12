import { Archive, Edit, FileText, Trash2 } from "lucide-react";
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
  const [updatingStatus, setUpdatingStatus] = useState("");

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

  const handlePublicationStatus = async (publicationStatus) => {
    setUpdatingStatus(publicationStatus);
    setError("");

    try {
      const payload = await eventsApi.updatePublicationStatus(code, publicationStatus);
      setEvent((currentEvent) => ({
        ...currentEvent,
        ...(payload ?? {}),
        publication_status: payload?.publication_status ?? publicationStatus,
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingStatus("");
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

  const isDraft = event.publication_status === "draft";
  const isArchived = event.publication_status === "archived";
  const canSendToReview = isDraft || isArchived;

  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Event detail"
        title={eventTitle(event)}
        description={event.subtitle || event.description || "No description"}
        actions={
          <>
            {!isDraft ? (
              <button
                className="button button--secondary"
                type="button"
                disabled={Boolean(updatingStatus)}
                onClick={() => handlePublicationStatus("draft")}
              >
                <FileText size={17} />
                {updatingStatus === "draft" ? "Updating..." : "Mark draft"}
              </button>
            ) : null}
            {!isArchived ? (
              <button
                className="button button--secondary"
                type="button"
                disabled={Boolean(updatingStatus)}
                onClick={() => handlePublicationStatus("archived")}
              >
                <Archive size={17} />
                {updatingStatus === "archived" ? "Updating..." : "Archive"}
              </button>
            ) : null}
            {canSendToReview ? (
              <button
                className="button button--secondary"
                type="button"
                disabled={Boolean(updatingStatus)}
                onClick={() => handlePublicationStatus("pending_review")}
              >
                <FileText size={17} />
                {updatingStatus === "pending_review" ? "Updating..." : "Send to review"}
              </button>
            ) : null}
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
