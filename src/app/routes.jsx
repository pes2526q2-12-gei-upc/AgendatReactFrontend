import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute.jsx";
import { AccessRequestPage } from "@/features/auth/pages/AccessRequestPage.jsx";
import { LoginPage } from "@/features/auth/pages/LoginPage.jsx";
import { PasswordSetupPage } from "@/features/auth/pages/PasswordSetupPage.jsx";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage.jsx";
import { EventDetailPage } from "@/features/events/pages/EventDetailPage.jsx";
import { EventFormPage } from "@/features/events/pages/EventFormPage.jsx";
import { EventsPage } from "@/features/events/pages/EventsPage.jsx";
import { MetricsPage } from "@/features/events/pages/MetricsPage.jsx";
import { AppLayout } from "@/app/layout/AppLayout.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/access-request" element={<AccessRequestPage />} />
      <Route path="/password-setup" element={<PasswordSetupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<EventFormPage mode="create" />} />
          <Route path="/events/:code" element={<EventDetailPage />} />
          <Route path="/events/:code/edit" element={<EventFormPage mode="edit" />} />
          <Route path="/events/:code/metrics" element={<MetricsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
