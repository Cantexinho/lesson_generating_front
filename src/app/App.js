import React, { useEffect, memo } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useSyncDarkMode } from "features/theme/hooks/useSyncDarkMode";
import { trackPageView } from "config/analytics";

const App = memo(() => {
  const location = useLocation();

  useSyncDarkMode();

  useEffect(() => {
    trackPageView();
  }, [location]);

  return (
    <div className="min-h-screen bg-secondary dark:bg-secondary-dark">
      <AppRoutes />
    </div>
  );
});

function Wrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Wrapper;
