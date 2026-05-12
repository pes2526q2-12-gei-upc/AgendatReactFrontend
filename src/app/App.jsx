import { AuthProvider } from "@/features/auth/context/AuthContext.jsx";
import { AppRoutes } from "@/app/routes.jsx";
import "@/styles/app.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
