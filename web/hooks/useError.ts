import { Dispatch, SetStateAction, useState } from "react";

export type ErrorMessage = string | null;
export type SetErrorMessage = Dispatch<SetStateAction<ErrorMessage>>;
export type OnCloseError = () => void;

const useError = (): {
  errorMessage: ErrorMessage;
  setErrorMessage: SetErrorMessage;
  onCloseError: OnCloseError;
} => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);

  const onCloseError = () => setErrorMessage(null);

  return { errorMessage, setErrorMessage, onCloseError };
};

export { useError };
