type Event = {
  action: string;
  category: string;
  label: string;
  value?: string;
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const enabledGa = GA_MEASUREMENT_ID !== "";

const pageview = (url: string): void => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

const event = ({ action, category, label, value }: Event): void => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export { GA_MEASUREMENT_ID, enabledGa, pageview, event };
