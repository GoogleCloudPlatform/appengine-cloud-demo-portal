import { useState } from "react";

const useTab = (): {
  value: number;
  onChange: (_event: React.ChangeEvent<unknown>, newValue: number) => void;
} => {
  const [value, setValue] = useState(0);

  const onChange = (_event: React.ChangeEvent<unknown>, newValue: number) =>
    setValue(newValue);

  return { value, onChange };
};

export { useTab };
