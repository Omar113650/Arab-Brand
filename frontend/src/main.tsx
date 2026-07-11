import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";

if (import.meta.env.PROD) {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    let [resource, config] = args;
    if (typeof resource === "string" && resource.startsWith("/api")) {
      resource = "https://arab-brand-4qj7.vercel.app" + resource;
    }
    return originalFetch(resource, config);
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);












// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );