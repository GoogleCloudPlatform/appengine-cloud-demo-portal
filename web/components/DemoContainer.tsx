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

import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { ErrorMessage as EM, OnCloseError } from "../hooks/useError";

import ErrorMessage from "./ErrorMessage";
import HelpButton from "./HelpButton";
import ProductChips from "./ProductChips";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      maxWidth: 1200,
    },
    panel: {
      padding: theme.spacing(4),
    },
    titleContainer: {
      paddingBottom: theme.spacing(2),
    },
    helpButtonContainer: {
      textAlign: "right",
    },
    description: {
      paddingBottom: theme.spacing(2),
    },
  })
);

type Props = {
  title: string;
  description: string;
  instructions: string[];
  productIds: string[];
  errorMessage: EM;
  onCloseError: OnCloseError;
};

const DemoContainer: React.FC<Props> = ({
  children,
  title,
  description,
  instructions,
  productIds,
  errorMessage,
  onCloseError,
}) => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Grid
        container
        direction="column"
        spacing={2}
        className={classes.container}
      >
        <Grid item>
          <Paper className={classes.panel}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.titleContainer}
            >
              <Grid item xs={11}>
                <Typography variant="h3" component="h2">
                  {title}
                </Typography>
              </Grid>
              <Grid item xs={1} className={classes.helpButtonContainer}>
                <HelpButton instructions={instructions} />
              </Grid>
            </Grid>
            <Typography
              variant="subtitle1"
              component="p"
              className={classes.description}
            >
              {description}
            </Typography>
            <ProductChips productIds={productIds} />
          </Paper>
        </Grid>
        {children}
      </Grid>
      {errorMessage ? (
        <ErrorMessage message={errorMessage} onClose={onCloseError} />
      ) : null}
    </main>
  );
};

export default DemoContainer;
