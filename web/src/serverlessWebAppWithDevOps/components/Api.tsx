import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import { useTranslation } from "../../../hooks/useTranslation";
import Code from "./Code";
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

const appYaml = `runtime: go115
service: api

instance_class: F4

handlers:
  - url: /.*
    secure: always
    script: auto

automatic_scaling:
  min_instances: 1`;
const cloudbuildYaml = `steps:
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    dir: api
    args:
      - gcloud
      - app
      - deploy
      - --project
      - $PROJECT_ID
      - --quiet`;

const Api: React.FC<Props> = ({ hidden }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tp = t.serverlessWebAppWithDevOps.gettingStarted;
  const tt = t.serverlessWebAppWithDevOps.gettingStarted.api;

  return (
    <Box hidden={hidden} className={classes.root}>
      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.overview}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.overview}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/nownabe/cloud-demos/tree/main/api">
            api source code on GitHub
          </ExternalLink>
        </li>
      </ul>

      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.appConfiguration}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.appConfiguration}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/nownabe/cloud-demos/tree/main/api/app.yaml">
            api/app.yaml on GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/appengine/docs/standard/go/config/appref">
            app.yaml reference
          </ExternalLink>
        </li>
      </ul>
      <Code language="yaml">{appYaml}</Code>

      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.buildConfiguration}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.buildConfiguration}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/nownabe/cloud-demos/blob/main/api/cloudbuild.yaml">
            api/cloudbuild.yaml on GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/build/docs/build-config">
            cloudbuild.yaml reference
          </ExternalLink>
        </li>
      </ul>
      <Code language="yaml">{cloudbuildYaml}</Code>
    </Box>
  );
};

export default Api;
