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
} from "@material-ui/core";
import Head from "next/head";

import Image from "../components/Image";
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
            src="/static/serverlessWebAppWithDevOps/architecture.png"
            alt="Architecture of serverless web app with DevOps"
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
