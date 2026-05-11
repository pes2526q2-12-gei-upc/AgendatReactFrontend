import { CalendarCheck, Eye, MousePointerClick, Share2, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eventsApi } from "@/features/events/api/eventsApi.js";
import { EmptyState } from "@/shared/ui/EmptyState/EmptyState.jsx";
import { LoadingState } from "@/shared/ui/LoadingState/LoadingState.jsx";
import { MetricCard } from "@/shared/ui/MetricCard/MetricCard.jsx";

function ratingValue(value) {
  return value === null || value === undefined ? "N/A" : Number(value).toFixed(1);
}

export function EventMetrics({ code, showFilters = false }) {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadMetrics() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await eventsApi.metrics(code, showFilters ? filters : {});
        if (isActive) {
          setMetrics(payload);
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

    loadMetrics();
    return () => {
      isActive = false;
    };
  }, [code, filters, showFilters]);

  const totals = metrics?.totals ?? {};
  const ratings = metrics?.ratings ?? {};
  const series = useMemo(() => metrics?.daily_series ?? [], [metrics]);

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <>
      {showFilters ? (
        <section className="toolbar toolbar--dates" aria-label="Metrics date filters">
          <label className="field">
            <span>From</span>
            <input name="from" type="date" value={filters.from} onChange={handleFilterChange} />
          </label>
          <label className="field">
            <span>To</span>
            <input name="to" type="date" value={filters.to} onChange={handleFilterChange} />
          </label>
        </section>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      {isLoading ? (
        <LoadingState label="Loading metrics" />
      ) : metrics ? (
        <>
          <div className="metrics-grid">
            <MetricCard label="Views" value={totals.views} icon={Eye} />
            <MetricCard label="Ticket clicks" value={totals.ticket_clicks} icon={MousePointerClick} />
            <MetricCard label="Shares" value={totals.shares} icon={Share2} />
            <MetricCard label="Saved attendance" value={totals.attendance_saves} icon={CalendarCheck} />
            <MetricCard label="Reviews" value={totals.reviews} icon={Star} />
          </div>
          <div className="charts-grid">
            <section className="panel chart-panel">
              <div className="panel__header">
                <h2>Daily engagement</h2>
              </div>
              {series.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#a92f29" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="ticket_clicks"
                      stroke="#d49b34"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="shares" stroke="#3b6f73" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No daily data" description="Metrics will appear as people interact with this event." />
              )}
            </section>
            <section className="panel chart-panel">
              <div className="panel__header">
                <h2>Saves and reviews</h2>
              </div>
              {series.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance_saves" fill="#8d2f25" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reviews" fill="#5d6268" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No review data" description="Reviews will appear after users rate the event." />
              )}
            </section>
          </div>
          <section className="panel rating-grid">
            <div>
              <span>Average rating</span>
              <strong>{ratingValue(ratings.average_rating)}</strong>
            </div>
            <div>
              <span>Accessibility</span>
              <strong>{ratingValue(ratings.average_accessibility_rating)}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>{ratingValue(ratings.average_price_rating)}</strong>
            </div>
            <div>
              <span>Atmosphere</span>
              <strong>{ratingValue(ratings.average_atmosphere_rating)}</strong>
            </div>
          </section>
        </>
      ) : (
        <EmptyState title="Metrics unavailable" description="This event has no metrics yet." />
      )}
    </>
  );
}
