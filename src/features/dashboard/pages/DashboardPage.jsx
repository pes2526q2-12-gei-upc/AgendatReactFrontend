import { CalendarCheck, Eye, MousePointerClick, Share2, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth.js";
import { eventsApi } from "@/features/events/api/eventsApi.js";
import {
  eventCode,
  eventLocation,
  eventTitle,
  formatDateRange,
} from "@/features/events/utils/events.js";
import { listFromResponse } from "@/shared/api/client.js";
import { EmptyState } from "@/shared/ui/EmptyState/EmptyState.jsx";
import { LoadingState } from "@/shared/ui/LoadingState/LoadingState.jsx";
import { MetricCard } from "@/shared/ui/MetricCard/MetricCard.jsx";
import { PageHeader } from "@/shared/ui/PageHeader/PageHeader.jsx";
import { StatusBadge } from "@/shared/ui/StatusBadge/StatusBadge.jsx";

const zeroTotals = {
  views: 0,
  ticket_clicks: 0,
  shares: 0,
  attendance_saves: 0,
  reviews: 0,
};

export function DashboardPage() {
  const { organization, role } = useAuth();
  const [events, setEvents] = useState([]);
  const [totals, setTotals] = useState(zeroTotals);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const eventList = listFromResponse(await eventsApi.events());
        const metricResponses = await Promise.allSettled(
          eventList.slice(0, 5).map((event) => eventsApi.metrics(eventCode(event))),
        );
        const nextTotals = metricResponses.reduce((accumulator, response) => {
          if (response.status !== "fulfilled") {
            return accumulator;
          }

          const responseTotals = response.value?.totals ?? {};
          return {
            views: accumulator.views + (responseTotals.views ?? 0),
            ticket_clicks:
              accumulator.ticket_clicks + (responseTotals.ticket_clicks ?? 0),
            shares: accumulator.shares + (responseTotals.shares ?? 0),
            attendance_saves:
              accumulator.attendance_saves + (responseTotals.attendance_saves ?? 0),
            reviews: accumulator.reviews + (responseTotals.reviews ?? 0),
          };
        }, zeroTotals);

        if (isActive) {
          setEvents(eventList);
          setTotals(nextTotals);
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

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const statusCounts = useMemo(() => {
    return events.reduce((accumulator, event) => {
      const status = event.publication_status ?? "draft";
      accumulator[status] = (accumulator[status] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [events]);

  if (isLoading) {
    return <LoadingState label="Loading dashboard" />;
  }

  return (
    <section className="page-stack">
      <PageHeader
        eyebrow={role ? `Role: ${role}` : "Backoffice"}
        title={`Welcome${organization?.name ? `, ${organization.name}` : ""}`}
        description="A compact overview of your events, publication pipeline, and audience activity."
        actions={
          <Link className="button button--primary" to="/events/new">
            Create event
          </Link>
        }
      />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="metrics-grid">
        <MetricCard label="Views" value={totals.views} icon={Eye} />
        <MetricCard label="Ticket clicks" value={totals.ticket_clicks} icon={MousePointerClick} />
        <MetricCard label="Shares" value={totals.shares} icon={Share2} />
        <MetricCard label="Saved attendance" value={totals.attendance_saves} icon={CalendarCheck} />
        <MetricCard label="Reviews" value={totals.reviews} icon={Star} />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Publication status</h2>
          </div>
          <div className="status-summary">
            {["pending_review", "published", "rejected", "archived", "draft"].map((status) => (
              <div key={status}>
                <StatusBadge status={status} />
                <strong>{statusCounts[status] ?? 0}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel__header">
            <h2>Recent events</h2>
            <Link to="/events">View all</Link>
          </div>
          {events.length ? (
            <div className="compact-list">
              {events.slice(0, 5).map((event) => (
                <Link key={eventCode(event)} to={`/events/${eventCode(event)}`}>
                  <div>
                    <strong>{eventTitle(event)}</strong>
                    <span>{formatDateRange(event)} - {eventLocation(event)}</span>
                  </div>
                  <StatusBadge status={event.publication_status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events yet"
              description="Create your first event to start the review process."
              action={
                <Link className="button button--primary" to="/events/new">
                  Create event
                </Link>
              }
            />
          )}
        </section>
      </div>
    </section>
  );
}
