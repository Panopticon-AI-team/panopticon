import { Metric } from "web-vitals";

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ onCLS, onFCP, onINP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onINP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
