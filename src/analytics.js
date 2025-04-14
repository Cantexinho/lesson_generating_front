import ReactGA from "react-ga4";

const ga_measurement_id = process.env.REACT_APP_GA_MEASUREMENT_ID;
ReactGA.initialize(ga_measurement_id);

export const trackPageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
};

export const trackEvent = (
  eventCategory,
  eventAction,
  eventLabel = "",
  eventValue = 0
) => {
  ReactGA.event({
    category: eventCategory,
    action: eventAction,
    label: eventLabel,
    value: eventValue,
  });
};
