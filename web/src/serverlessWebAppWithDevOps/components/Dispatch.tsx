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
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import { useTranslation } from "../../../hooks/useTranslation";
import Code from "../../../components/Code";
import ExternalLink from "./ExternalLink";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& li": theme.typography.body1,
    },
    heading: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
  })
);

type Props = {
  hidden: boolean;
};

const yaml = `dispatch:
  - url: "*/"
    service: default
  - url: "*/api/*"
    service: api`;

const Dispatch: React.FC<Props> = ({ hidden }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tt = t.serverlessWebAppWithDevOps.gettingStarted.dispatch;

  return (
    <Box hidden={hidden} className={classes.root}>
      <Typography variant="h4" component="h3" className={classes.heading}>
        dispatch.yaml
      </Typography>
      <Typography variant="body1" component="p">
        {tt.description}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/tree/main/dispatch.yaml">
            dispatch.yaml on GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/appengine/docs/standard/go/reference/dispatch-yaml">
            dispatch.yaml reference
          </ExternalLink>
        </li>
      </ul>
      <Code language="yaml">{yaml}</Code>
    </Box>
  );
};

export default Dispatch;
