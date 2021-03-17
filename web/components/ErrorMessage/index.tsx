import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

type Props = {
  open: boolean;
  onClose: () => void;
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ open, onClose, message }) => (
  <Snackbar
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    open={open}
    onClose={onClose}
    autoHideDuration={10000}
  >
    <MuiAlert onClose={onClose} severity="error" elevation={6} variant="filled">
      {message}
    </MuiAlert>
  </Snackbar>
);

export default ErrorMessage;
