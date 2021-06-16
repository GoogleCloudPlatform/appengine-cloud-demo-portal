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

import Head from "next/head";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";

import { useTranslation } from "../hooks/useTranslation";
import { demoIds } from "../src/demos";
import DemoCard from "../components/DemoCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    demoCard: {
      flexGrow: 1,
    },
  })
);

const Index: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <main className={classes.root}>
      <Head>
        <title>{t.title}</title>
      </Head>

      <Grid
        container
        spacing={3}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        alignContent="stretch"
      >
        {demoIds.map((demoId) => (
          <Grid
            item
            key={demoId}
            md={6}
            sm={12}
            xs={12}
            className={classes.demoCard}
          >
            <DemoCard demoId={demoId} />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Index;
