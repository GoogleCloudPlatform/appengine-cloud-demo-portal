/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { ErrorMessage as EM, OnCloseError } from "../hooks/useError";

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
