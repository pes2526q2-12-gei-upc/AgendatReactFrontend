import { Search } from "lucide-react";
import PropTypes from "prop-types";

const statuses = ["all", "pending_review", "published", "rejected", "archived", "draft"];

export function EventFilters({ query, statusFilter, onQueryChange, onStatusFilterChange }) {
  return (
    <section className="toolbar" aria-label="Event filters">
      <label className="search-field">
        <Search size={18} />
        <input
          value={query}
          placeholder="Search events..."
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <div className="segmented-control">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            data-active={statusFilter === status}
            onClick={() => onStatusFilterChange(status)}
          >
            {status === "all" ? "All" : status.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </section>
  );
}

EventFilters.propTypes = {
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
};
