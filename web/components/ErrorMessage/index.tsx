import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { ErrorMessage as EM, OnCloseError } from "../../hooks/useError";

type Props = {
  message: EM;
  onClose: OnCloseError;
};

const ErrorMessage: React.FC<Props> = ({ message, onClose }) => (
  <Snackbar
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    open={!!message}
    onClose={onClose}
    autoHideDuration={10000}
  >
    <MuiAlert onClose={onClose} severity="error" elevation={6} variant="filled">
      {message}
    </MuiAlert>
  </Snackbar>
);

export default ErrorMessage;
