import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EventFilters } from "@/features/events/components/EventFilters.jsx";
import { EventList } from "@/features/events/components/EventList.jsx";
import { eventsApi } from "@/features/events/api/eventsApi.js";
import { eventTitle } from "@/features/events/utils/events.js";
import { listFromResponse } from "@/shared/api/client.js";
import { EmptyState } from "@/shared/ui/EmptyState/EmptyState.jsx";
import { LoadingState } from "@/shared/ui/LoadingState/LoadingState.jsx";
import { PageHeader } from "@/shared/ui/PageHeader/PageHeader.jsx";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadEvents() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await eventsApi.events();
        if (isActive) {
          setEvents(listFromResponse(payload));
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

    loadEvents();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || event.publication_status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [eventTitle(event), event.subtitle, event.description, event.locality]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesQuery;
    });
  }, [events, query, statusFilter]);

  if (isLoading) {
    return <LoadingState label="Loading events" />;
  }

  return (
    <section className="page-stack">
      <PageHeader
        title="Events"
        description="Create, review, edit, and inspect the publication state of your organization events."
        actions={
          <Link className="button button--primary" to="/events/new">
            <Plus size={17} />
            New event
          </Link>
        }
      />
      <EventFilters
        query={query}
        statusFilter={statusFilter}
        onQueryChange={setQuery}
        onStatusFilterChange={setStatusFilter}
      />
      {error ? <p className="form-error">{error}</p> : null}
      {filteredEvents.length ? (
        <EventList events={filteredEvents} />
      ) : (
        <EmptyState
          title="No events match this view"
          description="Adjust your filters or create a new event for review."
          action={
            <Link className="button button--primary" to="/events/new">
              New event
            </Link>
          }
        />
      )}
    </section>
  );
}
