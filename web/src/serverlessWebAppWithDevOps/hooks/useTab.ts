import { useState } from "react";
import { event } from "../../gtag";

const useTab = (): {
  value: number;
  onChange: (_event: React.ChangeEvent<unknown>, newValue: number) => void;
} => {
  const [value, setValue] = useState(0);

  const onChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
    event({
      category: "serverlessWebAppWithDevOps",
      action: "switch_tab",
      label: newValue.toString(),
    });
  };

  return { value, onChange };
};

export { useTab };
