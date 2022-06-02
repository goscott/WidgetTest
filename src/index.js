import React from "react";
import { createRoot } from "react-dom/client";
import PowerMonitor from "./PowerMonitor";

document.querySelectorAll("div.power-monitor").forEach((div) => {
  createRoot(div).render(
    <React.StrictMode>
      <PowerMonitor
        deviceId={div.getAttribute("deviceId")}
        apiKey={div.getAttribute("apiKey")}
        url={div.getAttribute("url")}
      />
    </React.StrictMode>
  );
});
