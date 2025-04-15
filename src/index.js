import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./redux/themeSlice";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

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
