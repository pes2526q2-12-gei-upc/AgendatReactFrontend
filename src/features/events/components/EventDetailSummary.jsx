import PropTypes from "prop-types";
import { StatusBadge } from "@/shared/ui/StatusBadge/StatusBadge.jsx";
import { eventLocation, formatDateRange } from "@/features/events/utils/events.js";

function EventLink({ label, value }) {
  if (!value) {
    return (
      <div className="link-card link-card--disabled" aria-disabled="true">
        {label}
        <span>Not set</span>
      </div>
    );
  }

  return (
    <a className="link-card" href={value} target="_blank" rel="noreferrer">
      {label}
      <span>{value}</span>
    </a>
  );
}

export function EventDetailSummary({ event }) {
  return (
    <>
      <section className="panel detail-grid">
        <div>
          <span className="detail-label">Publication status</span>
          <StatusBadge status={event.publication_status} />
        </div>
        <div>
          <span className="detail-label">Dates</span>
          <strong>{formatDateRange(event)}</strong>
        </div>
        <div>
          <span className="detail-label">Location</span>
          <strong>{eventLocation(event)}</strong>
        </div>
        <div>
          <span className="detail-label">Price</span>
          <strong>{event.free ? "Free" : "Paid"}</strong>
        </div>
        <div>
          <span className="detail-label">Modality</span>
          <strong>{event.modality || "Not set"}</strong>
        </div>
        <div>
          <span className="detail-label">Schedule</span>
          <strong>{event.schedule || "Not set"}</strong>
        </div>
      </section>
      <section className="panel">
        <div className="panel__header">
          <h2>Description</h2>
        </div>
        <p className="long-copy">{event.description || "No description added yet."}</p>
      </section>
      <section className="panel link-grid">
        <EventLink label="Activity URL" value={event.url_activity} />
        <EventLink label="Ticket URL" value={event.url_ticket} />
      </section>
    </>
  );
}

const eventShape = PropTypes.shape({
  publication_status: PropTypes.string,
  free: PropTypes.bool,
  modality: PropTypes.string,
  schedule: PropTypes.string,
  description: PropTypes.string,
  url_activity: PropTypes.string,
  url_ticket: PropTypes.string,
});

EventLink.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

EventDetailSummary.propTypes = {
  event: eventShape.isRequired,
};
