import { Link, useParams } from "react-router-dom";
import { EventMetrics } from "@/features/events/components/EventMetrics.jsx";
import { PageHeader } from "@/shared/ui/PageHeader/PageHeader.jsx";

export function MetricsPage() {
  const { code } = useParams();

  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Event metrics"
        title="Performance dashboard"
        description={`Event ${code}`}
        actions={
          <Link className="button button--secondary" to={`/events/${code}`}>
            Back to event
          </Link>
        }
      />
      <EventMetrics code={code} showFilters />
    </section>
  );
}
