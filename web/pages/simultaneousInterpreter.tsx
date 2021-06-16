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

import DemoContainer from "../components/DemoContainer";
import Recorder from "../components/Recorder";
import { useTranslation } from "../hooks/useTranslation";
import { demos } from "../src/demos";
import {
  useLanguages,
  useRecorder,
  useTranslations,
} from "../src/simultaneousInterpreter/hooks";
import Translations from "../src/simultaneousInterpreter/components/Translations";
import { useError } from "../hooks/useError";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      padding: theme.spacing(4),
    },
    translations: {
      padding: theme.spacing(4),
      height: "70vh",
    },
  })
);

const demo = demos["simultaneousInterpreter"];

const SimultaneousInterpreter: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { errorMessage, setErrorMessage, onCloseError } = useError();
  const { translations, addTranslations } = useTranslations();
  const { onStart, onStop } = useRecorder(addTranslations, setErrorMessage);
  const { languages, defaultLanguage } = useLanguages(setErrorMessage);

  return (
    <DemoContainer
      title={t.simultaneousInterpreter.title}
      description={t.simultaneousInterpreter.description}
      instructions={t.simultaneousInterpreter.instructions}
      productIds={demo.products}
      errorMessage={errorMessage}
      onCloseError={onCloseError}
    >
      <Head>
        <title>
          {t.simultaneousInterpreter.title} | {t.title}
        </title>
      </Head>
      <Grid item>
        <Paper className={classes.panel}>
          <Recorder
            onStart={onStart}
            onStop={onStop}
            languages={languages}
            defaultLanguage={defaultLanguage}
          />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.translations}>
          <Translations translations={translations} />
        </Paper>
      </Grid>
    </DemoContainer>
  );
};

export default SimultaneousInterpreter;
