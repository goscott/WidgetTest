import React, { useState, useEffect } from "react";
import "./PowerMonitor.css";

const NUM_MINUTES_BEFORE_FREE = 10;

const getBusyStatus = (secondsSinceLastSeen) => {
  if (!secondsSinceLastSeen) {
    return {};
  }
  const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });
  if (secondsSinceLastSeen < 60) {
    return {
      message: formatter.format(-Math.round(secondsSinceLastSeen), "seconds"),
      busy: true,
    };
  }
  if (secondsSinceLastSeen < 60 * 60) {
    return {
      message: formatter.format(
        -Math.round(secondsSinceLastSeen / 60),
        "minutes"
      ),
      busy: secondsSinceLastSeen < 60 * NUM_MINUTES_BEFORE_FREE,
    };
  }
  if (secondsSinceLastSeen < 60 * 60 * 24) {
    return {
      message: formatter.format(
        -Math.round(secondsSinceLastSeen / (60 * 60)),
        "hours"
      ),
      busy: false,
    };
  }
  return {
    message: formatter.format(
      -Math.round(secondsSinceLastSeen / (60 * 60 * 24)),
      "days"
    ),
    busy: false,
  };
};

function PowerMonitor({ deviceId, apiKey, url }) {
  const [loading, setLoading] = useState(false);
  const [secondsSinceLastSeen, setSecondsSinceLastSeen] = useState();
  const [apiError, setApiError] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${url}/${deviceId}`, { headers: { "X-Api-Key": apiKey } })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          setApiError(data.error);
        } else {
          setSecondsSinceLastSeen(
            (new Date().getTime() - data.lastSeen) / 1000
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setApiError("Unable to fetch device state");
      });
  }, [deviceId, apiKey]);

  const busyStatus = getBusyStatus(secondsSinceLastSeen);

  return (
    <div
      className={`PowerMonitor PowerMonitor-${
        apiError
          ? "error"
          : !secondsSinceLastSeen
          ? "none"
          : busyStatus.busy
          ? "busy"
          : "free"
      }`}
    >
      <header className="PowerMonitor-header">
        {deviceId.replace(/-/g, " ") || "Unknown Device"}
      </header>
      {apiError ? (
        <div>{apiError}</div>
      ) : loading ? (
        <div className="PowerMonitor-loader"></div>
      ) : (
        secondsSinceLastSeen && (
          <div>
            <div className="PowerMonitor-message">
              {busyStatus.busy ? "Currently in use" : "Currently available"}
            </div>
            <i className="PowerMonitor-subtitle">
              Last used {busyStatus.message}
            </i>
          </div>
        )
      )}
    </div>
  );
}

export default PowerMonitor;
