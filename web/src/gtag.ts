type Event = {
  action: string;
  category: string;
  label: string;
  value?: string;
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const enabledGa = GA_MEASUREMENT_ID !== "";

const pageview = (url: string): void => {
  try {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } catch (e) {
    console.error(e);
  }
};

const event = ({ category, action, label, value }: Event): void => {
  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (e) {
    console.error(e);
  }
};

export { GA_MEASUREMENT_ID, enabledGa, pageview, event };
