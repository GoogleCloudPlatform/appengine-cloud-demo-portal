import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import Head from "next/head";
import Image from "next/image";
import DemoContainer from "../components/DemoContainer";
import { useError } from "../hooks/useError";
import { useTranslation } from "../hooks/useTranslation";
import { demos } from "../src/demos";
import GettingStarted from "../src/serverlessWebAppWithDevOps/components/GettingStarted";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      padding: theme.spacing(4),
    },
    architecture: {},
  })
);

const demo = demos["serverlessWebAppWithDevOps"];

const ServerlessWebAppWithDevOps: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { errorMessage, onCloseError } = useError();

  return (
    <DemoContainer
      title={t.serverlessWebAppWithDevOps.title}
      description={t.serverlessWebAppWithDevOps.description}
      instructions={t.serverlessWebAppWithDevOps.instructions}
      productIds={demo.products}
      errorMessage={errorMessage}
      onCloseError={onCloseError}
    >
      <Head>
        <title>
          {t.serverlessWebAppWithDevOps.title} | {t.title}
        </title>
      </Head>
      <Grid item>
        <Paper className={classes.panel}>
          <Image
            src="/images/serverlessWebAppWithDevOps/architecture.png"
            alt="Architecture of serverless web app with DevOps"
            className={classes.architecture}
            width={2017}
            height={781}
          />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.panel}>
          <GettingStarted />
        </Paper>
      </Grid>
    </DemoContainer>
  );
};

export default ServerlessWebAppWithDevOps;
