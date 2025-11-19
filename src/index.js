import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "app/store";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

const google_client_id = process.env.REACT_APP_OAUTH_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId={google_client_id}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);

reportWebVitals();
