import { useState } from "react";

import { onChangeTabEvent } from "../gtag";

const useTab = (): {
  value: number;
  onChange: (_event: React.ChangeEvent<unknown>, newValue: number) => void;
} => {
  const [value, setValue] = useState(0);

  const onChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    onChangeTabEvent(newValue);
    setValue(newValue);
  };

  return { value, onChange };
};

export { useTab };
