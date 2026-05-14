import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/shared/ui/StatusBadge/StatusBadge.jsx";
import {
  eventCode,
  eventLocation,
  eventTitle,
  formatDateRange,
} from "@/features/events/utils/events.js";

export function EventList({ events }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <Link className="event-row" key={eventCode(event)} to={`/events/${eventCode(event)}`}>
          <div>
            <h2>{eventTitle(event)}</h2>
            <p>{event.subtitle || event.description || "No description"}</p>
            <span>
              {formatDateRange(event)} - {eventLocation(event)}
            </span>
          </div>
          <div className="event-row__meta">
            <StatusBadge status={event.publication_status} />
            <strong>{event.free ? "Free" : "Paid"}</strong>
          </div>
        </Link>
      ))}
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      denomination: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      publication_status: PropTypes.string,
      free: PropTypes.bool,
    }),
  ).isRequired,
};
