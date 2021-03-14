type Demo = {
  path: string;
  products: string[];
  icon: string;
};

const demos: { [key: string]: Demo } = {
  contactCenterAnalysis: {
    path: "/contactCenterAnalysis",
    products: ["speech-to-text", "natural-language-api"],
    icon: "/images/contactCenterAnalysis.jpg",
  },
};

const demoIds = Object.keys(demos).sort();

export { demos, demoIds };
