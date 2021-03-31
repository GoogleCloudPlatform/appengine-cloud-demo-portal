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

const appYaml = `runtime: nodejs14
instance_class: F1

handlers:
  - url: /.*
    secure: always
    script: auto

automatic_scaling:
  min_instances: 1`;

const Web: React.FC<Props> = ({ hidden }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tp = t.serverlessWebAppWithDevOps.gettingStarted;
  const tt = t.serverlessWebAppWithDevOps.gettingStarted.web;

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
          <ExternalLink href="https://github.com/nownabe/cloud-demos/tree/main/web">
            web source code
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
          <ExternalLink href="https://github.com/nownabe/cloud-demos/tree/main/web/app.yaml">
            web/app.yaml
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/appengine/docs/standard/nodejs/config/appref">
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
    </Box>
  );
};

export default Web;
